#CONFIG
inputfile="./src/assets/version.txt"
versionfile="./src/assets/version.ts"
nvmfile="./.nvmrc"
port=8112

action=$1
environment=$2

#read or ask for the action (serve/build)

if [[ $action != "serve" && $action != "ios" && $action != "android" && $action != "mobile" ]]; then
    echo "Select action:"
    select slctaction in "serve" "build android" "build ios" "build android and ios" "exit"; do
        case $slctaction in
        "serve")
            action=serve
            break
            ;;
        "build android")
            action=android
            break
            ;;
        "build ios")
            action=ios
            break
            ;;
        "build android and ios")
            action=mobile
            break
            ;;
        "exit")
            echo "exit script"
            exit
            ;;
        *) echo "--Invalid selection--" ;;
        esac
    done
fi

#select the environment

if [[ $environment != "development" && $environment != "production" ]]; then
    echo "Select environment:"
    select environment in development production exit; do
        case $environment in
        development)
            break
            ;;
        production)
            break
            ;;
        exit)
            echo "exit script"
            exit
            ;;
        *) echo "--Invalid selection--" ;;
        esac
    done
fi

if [[ $action != "serve" ]]; then

    #CHECK EXIST VERSION

    #Read version
    read -r MAYOR MINOR BUILD ANDROIDVERSION <"$inputfile"

    #Check old  archive
    if [ -f $archivepath ]; then
        echo "Use last version ${MAYOR}.${MINOR}.${BUILD} - ${ANDROIDVERSION}"
        select USELAST in no yes exit; do
            case $USELAST in
            no | yes) break ;;
            exit)
                echo "exit script"
                exit
                ;;
            *) echo "--Invalid selection--" ;;
            esac
        done
    else
        USELAST=no
    fi

    if [[ $USELAST = no ]]; then
        echo 'update version'
        #ask new version
        echo "Last version: $MAYOR.$MINOR.$BUILD - ${ANDROIDVERSION}"
        read -p "New mayor (last $MAYOR) - enter for no change?" newMayor
        if [[ -z "$newMayor" ]]; then
            read -p "New minor (last $MINOR) - enter for no change?" newMinor
            if [[ -z "$newMinor" ]]; then
                BUILD=$(($BUILD + 1))
            else
                MINOR="$newMinor"
                BUILD=0
            fi
        else
            MAYOR="$newMayor"
            MINOR=0
            BUILD=0
        fi

        echo "New version: $MAYOR.$MINOR.$BUILD"
        echo "$ANDROIDVERSION"

        ANDROIDVERSION=$(($ANDROIDVERSION + 1))

        echo "Update version to ${MAYOR}.${MINOR}.${BUILD} ${ANDROIDVERSION}"

        #update file txt
        echo "$MAYOR" "$MINOR" "$BUILD" "$ANDROIDVERSION" >"$inputfile"

        #update file ts
        echo "export const version = { mayor: $MAYOR, minor: $MINOR, build: $BUILD, android: $ANDROIDVERSION }" >"$versionfile"

        #update package.json
        eval "npm version $MAYOR.$MINOR.$BUILD --no-git-tag-version"
    fi

fi

#print values

#start timer
START=$(date +%s)

#resume
echo "---------------------------"
echo "Let's go!"

echo "Action: $action"
echo "Environment: $environment"

#Read nvm
read -r NVMVERSION <"$nvmfile"

if [[ $NVMVERSION != '' ]]; then
    eval "nvm use $NVMVERSION"
    echo "NVM version: $NVMVERSION"
    SLEEP 1
fi

# Update version

if [[ $action == "android" || $action == "mobile" ]]; then
    echo "Updating android app version"
    eval "npx capacitor-set-version set:android -v $MAYOR.$MINOR.$BUILD -b $ANDROIDVERSION"
fi

if [[ $action == "mobile" || $action == "ios" ]]; then
    echo "Updating ois app version"
    eval "npx capacitor-set-version set:ios -v $MAYOR.$MINOR.$BUILD"
fi

# run command

execmd=""

# isverbose="--verbose"

isprod=""
if [[ $environment == "production" ]]; then
    isprod="--production"
fi

if [[ $action == "android" || $action == "mobile" ]]; then
    echo "Building android app"
    execmd="ionic build $isprod -c $environment $isverbose && npx cap sync android && npx cap open android"

fi

if [[ $action == "ios" || $action == "mobile" ]]; then
    echo "Building ios app"
    execmd="ionic build $isprod -c $environment $isverbose && npx cap sync ios && npx cap open ios"
fi

if [[ $action == "serve" ]]; then
    echo "Serving app"
    execmd="ionic serve --port $port -c $environment $isverbose"
fi

echo "executing command: $execmd"
eval $execmd

#end messages
echo "complete"
#calculate time
END=$(date +%s)
DIFF=$(($END - $START))
echo "It took $DIFF seconds"
