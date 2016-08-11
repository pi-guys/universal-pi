# universal-pi

Univeral Pi is an application that adapts signals sent from infrared remotes and combines them into one interface.  Remotes are configured via lirc, a linux-based package for interpreting infrared signals, and signals are sent via a Raspberry Pi to a specified device.  All configured remotes are saved in a Mongo database on Heroku and can be accessed by making http requests to `universal-pi.herokuapp.com` at remote-specific endpoints.

## Installation
First, clone down our project repo to your local machine. Then, use `npm i` to install dependencies via `package.json`.

### Setup Raspberry Pi
Raspberry Pi has to be ready to transmit infrared signals. Open the terminal in your Pi and type `sudo apt-get install lirc`. Next, navigate to your `/etc/modules` and make sure you're using the Pi's default GPIO pins (GPIO pin 17 for input, 18 for output). Then, navigate to `/etc/lirc/hardware.conf` and add these lines....

Finally, you want to reboot your Pi. Then, open the terminal again and type `sudo /etc/init.d/lirc start`. Now your Pi is ready to transmit ir signals.

For example: making a POST request to universal-pi.herokuapp.com/Vizio/KEY_POWER would turn on/off the tv.
