# Lifeline Hardware

## Components
- ESP32-WROOM-32 Development Board
- ISD1820 Voice Recording/Playback Module
- Green LED (System Status)
- Yellow LED (Disaster Alert)
- Red LED (Critical Alert)
- Blue LED (Network Connected)
- 220Ω resistors for LEDs
- 10kΩ pull-up resistor on EN pin

## GPIO Mapping

GPIO14 -> ISD1820 PLAYL
GPIO15 -> ISD1820 PLAYE
GPIO16 -> ISD1820 REC

GPIO18 -> GREEN_STATUS
GPIO19 -> YELLOW_DISASTER
GPIO21 -> RED_CRITICAL
GPIO22 -> BLUE_CONNECTED

## Notes

The ISD1820 module provides local audio alerts in disaster scenarios.

The ESP32 serves as the node controller.

Future versions may integrate LoRa communication and autonomous vehicle dispatch hardware.