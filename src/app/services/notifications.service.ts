import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { EventsService } from './events.service';
import { Settings } from '../models/settings';
import { CalendarEventGroup } from '../models/event';
import { LocalNotificationSchema, LocalNotifications } from '@capacitor/local-notifications';
import { addDays, isBefore, isSameDay } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private settingsService: SettingsService,
    private eventService: EventsService
  ) {
    this.settingsService.updatedSettings.subscribe((settings) => {
      this.setNotifications(settings);
    });
    this.eventService.events.subscribe((events) => {
      this.setNotifications(undefined, events);
    });
  }

  async setNotifications(settings?: Settings, events?: CalendarEventGroup[]) {
    if (!settings) {
      settings = await this.settingsService.getSettings();
    }
    if (!events) {
      const canteens = await this.settingsService.getMyCanteens();
      events = await this.eventService.getEvents(canteens).toPromise();
    }

    this.eraseOldNotifications();

    if (settings.notifications) {
      if (!await LocalNotifications.checkPermissions()) {
        await LocalNotifications.requestPermissions();
      }
      if (await LocalNotifications.checkPermissions() && events) {
        await this.scheduleNotifications(settings, events);
      }
    }
  }

  private async eraseOldNotifications() {
    // console.log("------- ~ NotificationsService ~ eraseOldNotifications ~ eraseOldNotifications")
    const pendings = await LocalNotifications.getPending();
    LocalNotifications.cancel(pendings);
  };


  private async scheduleNotifications(settings: Settings, events: CalendarEventGroup[]) {
    let count = 0;
    const schemas: LocalNotificationSchema[] = [];
    events.forEach((event: CalendarEventGroup) => {
      if (isBefore(event.date, new Date()) && !isSameDay(event.date, new Date())) return;
      count++;
      let fullString = ``;
      event.events.filter(x => x.canteen.notifications).forEach((event) => {
        fullString = fullString.concat(`**${event.canteen.name}**\n`);
        fullString = fullString.concat(event.foods.join('\n'));
        fullString = fullString.concat('\n');
      });
      if (!fullString) return;
      const notificationDate = new Date(event.date);
      notificationDate.setHours(settings.notificationsTimeHour);
      notificationDate.setMinutes(settings.notificationsTimeMinute);
      addDays(notificationDate, -settings.notificationsDay);

      const schema: LocalNotificationSchema = {
        title: 'Menu del giorno',
        body: `giorno ${event.date.toLocaleDateString()}`,
        largeBody: fullString,
        // summaryText	string	Used to set the summary text detail in inbox and big text notification styles.Only available for Android.
        id: count,
        schedule: {
          at: notificationDate,	//Date	Schedule a notification at a specific date and time.
          repeats: false, //	boolean	Repeat delivery of this notification at the date and time specified by at. Only available for iOS and Android.
          allowWhileIdle: true, //	boolean	Allow this notification to fire while in Doze Only available for Android 23+. Note that these notifications can only fire once per 9 minutes, per app.
          // on	ScheduleOn	Schedule a notification on particular interval(s). This is similar to scheduling cron jobs. Only available for iOS and Android.
          // every	ScheduleEvery	Schedule a notification on a particular interval.
          // count	number	Limit the number times a notification is delivered by the interval specified by every.
        },
        sound: 'android.resource://it.bionicco.refezione/raw/bubble.wav',	//string	Name of the audio file to play when this notification is displayed.Include the file extension with the filename.On iOS, the file should be in the app bundle.On Android, the file should be in res/ raw folder.Recommended format is.wav because is supported by both iOS and Android.Only available for iOS and Android < 26. For Android 26 + use channelId of a channel configured with the desired sound.If the sound file is not found, (i.e.empty string or wrong name) the default system notification sound will be used. If not provided, it will produce the default sound on Android and no sound on iOS
        // smallIcon	string	Set a custom status bar icon.If set, this overrides the smallIcon option from Capacitor configuration.Icons should be placed in your app's res/drawable folder. The value for this option should be the drawable resource ID, which is the filename without an extension. Only available for Android.
        // largeIcon	string	Set a large icon for notifications.Icons should be placed in your app's res/drawable folder. The value for this option should be the drawable resource ID, which is the filename without an extension. Only available for Android.
        // iconColor	string	Set the color of the notification icon.Only available for Android.
        // attachments	Attachment[]	Set attachments for this notification.
        // actionTypeId	string	Associate an action type with this notification.
        // extra	any	Set extra data to store within this notification.
        // threadIdentifier	string	Used to group multiple notifications.Sets threadIdentifier on the UNMutableNotificationContent.Only available for iOS.
        // summaryArgument	string	The string this notification adds to the category's summary format string. Sets summaryArgument on the UNMutableNotificationContent. Only available for iOS.
        // group	string	Used to group multiple notifications.Calls setGroup() on NotificationCompat.Builder with the provided value.Only available for Android.
        // groupSummary	boolean	If true, this notification becomes the summary for a group of notifications.Calls setGroupSummary() on NotificationCompat.Builder with the provided value.Only available for Android when using group.
        // channelId	string	Specifies the channel the notification should be delivered on.If channel with the given name does not exist then the notification will not fire.If not provided, it will use the default channel.Calls setChannelId() on NotificationCompat.Builder with the provided value.Only available for Android 26 +.
        // ongoing	boolean	If true, the notification can't be swiped away. Calls setOngoing() on NotificationCompat.Builder with the provided value. Only available for Android.
        // autoCancel	boolean	If true, the notification is canceled when the user clicks on it.Calls setAutoCancel() on NotificationCompat.Builder with the provided value.Only available for Android.
        // inboxList	string[]	Sets a list of strings for display in an inbox style notification.Up to 5 strings are allowed.Only available for Android.
      };
      schemas.push(schema);
    });
    if (schemas?.length && events?.length) {
      schemas.push(this.getFinalNotificationSchema(settings, events));
    }
    LocalNotifications.schedule({ notifications: schemas });
    console.log("------- ~ NotificationsService ~ scheduleNotifications ~ schemas:", schemas);
  }

  getFinalNotificationSchema(settings: Settings, events: CalendarEventGroup[]): LocalNotificationSchema {
    const lastDate = events[events.length - 1].date;
    addDays(lastDate, 1);
    const notificationDate = new Date(lastDate);
    notificationDate.setHours(settings.notificationsTimeHour);
    notificationDate.setMinutes(settings.notificationsTimeMinute);
    addDays(notificationDate, -settings.notificationsDay);
    return {
      title: 'Nessun menu disponibile',
      body: `Non risulta nessun menu disponibile per i prossimi giorni`,
      largeBody: `Si prega di aprire l'app per fare un aggiornamento dei dati e verificare se sono disponibili nuovi menu`,
      id: events.length + 2,
      schedule: {
        at: addDays(notificationDate, 1),
        repeats: false,
        allowWhileIdle: true,
      },
      sound: 'android.resource://it.bionicco.refezione/raw/bubble.wav',
    };
  }

}
