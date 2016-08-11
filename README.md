# universal-pi

universal-pi is an application that adapts signals sent from infrared remotes and combines them into one interface.  Remotes are configured via lirc, a linux-based package for interpreting infrared signals, and signals are sent via a Raspberry Pi to a specified device.  

Remote commands can be initiated by making http requests to https://universal-pi.herokuapp.com at remote-specific endpoints.  

Initial Raspberry Pi setup to interact with lirc requires very specific and somewhat verbose instructions--those can be found at the bottom of the readme file.
For convenience, commands are outlaid near the beginning of this readme.  

## Getting Started
To install, simply clone down the project repo and use `npm i` to install dependencies listed in the `package.json` file.  Both of these commands will need to be performed on the Raspberry Pi as well.

### Interacting with a Device
All commands are requested through a heroku endpoint.  Provided a device is configured ([see below at Raspberry Pi Setup](#pi)), and Raspberry Pi's IR transmitter is in reach of the device, requests can be made from a computer anywhere with an internet connection.

- Prior to submitting a command, the Raspberry Pi must be ready to receive.  To do so, run the following command from the Raspberry Pi in the project folder

  `node app`

- Then, simply perform a request from a computer. For example:  using the command line, the following command would turn on/off the tv.

  `curl https://universal-pi.herokuapp.com/api/remote/Vizio/KEY_POWER`

- For simplicity, a command line interface (CLI) has been created.  With the project directory as the present working directory, the following line would execute the same command

  `node c key Vizio power`

##### CLI Directions
  - `node` and `c` (the name of the CLI file) must always be the first two arguments
  -  `key` as the third argument, indicates that a remote command will be used
  - The fourth argument refers to the device, in this case, the `Vizio` tv
  - The fifth argument refers to the button, here `KEY_POWER`

  An example list of all buttons configured to this device can be found in the project at `programmed_buttons.txt`, this listing mirrors the `/etc/lirc/lircd.conf` file found on the Raspberry Pi

### User Accounts
Simple implementation of user accounts have been included for universal-pi, however, this feature is currently in public beta.  Admin privileges have the capacity to remove other users.  
Future versions would aim to add users to groups related to specific devices.  If a user didn't belong to a particular group, that user wouldn't be authorized to utilize that device.

<a name="pi"></a>
## Raspberry Pi Setup
By nature, Raspberry Pi offers an incredibly diverse palette of implementation.  As such, it ships in a very customizable state--that being said, some initial customization is necessary in order to be prepped for universal-pi.

Needed for lirc to function is an IR transmitter connected to the Raspberry Pi, this is a very simple solution [Raspberry Pi IR Shield](https://www.amazon.com/Infrared-Shield-Raspberry-Pi/dp/B01C2AQL62).

Below are the quickstart directions to be completed in the command line for getting a Raspberry Pi ready for universal-pi.

#### Pi Pre-Prep, Presuming the Raspbian OS
  - Update Raspbian to the Latest Version

    ```
    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get dist-upgrade
    ```
  - Upgrade Raspberry Pi Firmware

    ```
    sudo apt-get install git-core
    sudo wget http://goo.gl/1BOfJ -O /usr/bin/rpi-update && sudo chmod +x /usr/bin/rpi-update
    sudo rpi-update
    ```

- lirc Setup
  - lirc Download

    `sudo apt-get install lirc`
  - lirc Configuration Files
   - Make sure the following lines are included in the `/etc/modules` file
     ```
     12c-dev
     lirc_dev
     lirc_rpi
     ```
   - Modify the `/etc/lirc/hardware.conf` file in a text editor (default Leafpad) to appear as below
      ```
      # /etc/lirc/hardware.conf
      #
      # Arguments which will be used when launching lirc
      LIRCD_ARGS=""

      #Don't start lircmd even if there seems to be a good config file
      #START_LIRCMD=false

      #Don't start irexec, even if a good config file seems to exist.
      #START_IREXEC=false

      #Try to load appropriate kernel modules
      LOAD_MODULES=true

      # Run "lircd --driver=help" for a list of supported drivers.
      DRIVER="default"
      # usually /dev/lirc0 is the correct setting for systems using udev
      DEVICE="/dev/lirc0"
      MODULES="lirc_rpi"

      # Default configuration files for your hardware if any
      LIRCD_CONF=""
      LIRCMD_CONF=""
      ```
    - Make sure the following lines are included in the `/boot/config.txt` file

      ```      
      dtoverlay=lirc-rpi

      # hardware
      dtparam=i2c_arm=on
      dtparam=is2=on
      dtparam=spi=on
      dtoverlay=lirc-rpi
      ```

  - Restart the Raspberry Pi for the configurations to take effect

    `sudo reboot`
  - Initializing a Remote
    - To test that an IR receiver is properly connected to the Raspberry Pi, type the following commands into the command line then aim a remote at the IR receiver and press any button on the remote
      ```
      sudo /etc/init.d/lirc stop
      mode2 -d /dev/lirc0
      ```

      The command line should output several lines similar to below
      ```
      space 3136090
      pulse 9147
      space 4305
      pulse 728
      space 385
      pulse 734
      ```
    - Configuring a Remote

      -  The below commands will free up the lirc driver for recording, create a new configuration file, and restart the lirc driver to be used again

        ```
        sudo /etc/init.d/lirc stop
        irrecord -d /dev/lirc0 ~/lircd.conf
        sudo mv /etc/lirc/lircd.conf /etc/lirc/lircd_original.conf
        sudo cp ~/lircd.conf /etc/lirc/lircd.conf
        sudo /etc/init.d/lirc start
        ```
