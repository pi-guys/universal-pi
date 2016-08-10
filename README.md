# universal-pi

Univeral Pi is an application that adapts signals sent from infrared remotes and combines them into one interface.  Remotes are configured via lirc, a linux-based package for interpreting infrared signals, and signals are sent via a Raspberry Pi to a specified device.  All configured remotes are saved in a Mongo database on Heroku and can be accessed by making http requests to universal-pi.herokuapp.com at remote-specific endpoints.

For example: making a POST request to universal-pi.herokuapp.com/Vizio/KEY_POWER would turn on/off the tv.
