---
title: "SKU: A000066"
---

User Manual

## SKU: A000066

### Description

[The Arduino® UNO R3 is the perfect board to get familiar with electronics and coding. This versatile development](https://www.arduino.cc/)

board is equipped with the well-known ATmega328P and the ATMega 16U2 Processor.

This board will give you a great [rst experience within the world of Arduino.](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending)

### Target areas:

Maker, introduction, industries

### Features

ATMega328P Processor

### Memory

AVR CPU at up to 16 MHz

32 kB Flash

2 kB SRAM

1 kB EEPROM

### Security

[Power On Reset (POR)](https://create.arduino.cc/editor)

Brown Out Detection (BOD)

### Peripherals

[2x 8-bit Timer/Counter with a dedicated period register and compare channels](https://www.arduino.cc/en/Main/Software)

[1x 16-bit Timer/Counter with a dedicated period register, input capture and compare channels](https://create.arduino.cc/editor)

1x USART with fractional baud rate generator and start-of-frame detection

[1x controller/peripheral Serial Peripheral Interface (SPI)](https://docs.arduino.cc/arduino-cloud/guides/editor/)

[1x Dual mode controller/peripheral I2C](https://store.arduino.cc/)

[1x Analog Comparator (AC) with a scalable reference input](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending)

Watchdog Timer with separate on-chip oscillator

Six PWM channels

Interrupt and wake-up on pin change

### ATMega16U2 Processor

8-bit AVR® RISC-based microcontroller

### Memory

16 kB ISP Flash

## 512B EEPROM

## 512B SRAM

debugWIRE interface for on-chip debugging and programming

### Power

[2.7-5.5 volts](https://echa.europa.eu/web/guest/candidate-list-table)

# CONTENTS

## 1 The Board 5

## 1.1 Application Examples 5

## 1.2 Related Products 5

## 2 Ratings 6

## 2.1 Recommended Operating Conditions 6

## 2.2 Power Consumption 6

## 3 Functional Overview 6

## 3.1 Board Topology 6

## 3.2 Processor 7

## 3.3 Power Tree 8

## 4 Board Operation 9

## 4.1 Getting Started - IDE 9

## [4.2 Getting Started - Arduino Cloud Editor](https://www.arduino.cc/reference/en/) 9

## [4.3 Sample Sketches](https://store.arduino.cc/) 9

## 4.4 Online Resources 9

## 5 Connector Pinouts 10

## 5.1 JANALOG 11

## 5.2 JDIGITAL 11

## 5.3 Mechanical Information 12

## 5.4 Board Outline & Mounting Holes 12

## 6 Certi cations 13

## 6.1 Declaration of Conformity CE DoC (EU) 13

## 6.2 Declaration of Conformity to EU RoHS & REACH 211 01/19/2021 13

## 6.3 Con fl ict Minerals Declaration 14

## 7 FCC Caution 14

## 8 Company Information 15

## 9 Reference Documentation 15

## 10 Revision History 15

11 电 路 板 简 介

11.1 应 ⽤ ⽰ 例

11.2 相 关 产 品

12 额 定 值

12.1 建 议 运 ⾏ 条 件

12.2 功 耗

13 功 能 概 述

13.1 电 路 板 拓扑 结 构

13.2 处 理 器

13.3 电 源 树

14 电 路 板 操 作

## 14.1 ⼊ ⻔ 指 南 - IDE

14.2 ⼊ ⻔ 指 南 - Arduino Cloud Editor

14.3 ⽰ 例 程 序

14.4 在 线 资 源

15 连 接 器 引 脚 布 局

## 15.1 JANALOG 22

## 15.2 JDIGITAL 22

15.3 机 械 层 信 息

15.4 电 路 板 外 形 图 和 安 装 孔

16 认证

16.1 [符](https://store.arduino.cc/) [合](https://store.arduino.cc/) [性](https://store.arduino.cc/) [声](https://store.arduino.cc/) [明](https://store.arduino.cc/) CE DoC （ 欧 盟 ）

16.2 声 明 符 合 欧 盟 RoHS 和 [REACH 211 01/19/2021](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending)

16.3 冲 突 矿 产 声 明

## 17 FCC 警 告

18 公 司 信 息

19 参 考 资 料

20 修 订记 录

## 1 The Board

## 1.1 Application Examples

The UNO board is the fl agship product of Arduino. Regardless if you are new to the world of electronics or will use

the UNO R3 as a tool for education purposes or industry-related tasks, the UNO R3 is likely to meet your needs.

First entry to electronics: If this is your rst project within coding and electronics, get started with our most used

[and documented board; UNO. It is equipped with the well-known ATmega328P processor, 14 digital input/output](https://create.arduino.cc/editor)

[pins, 6 analog inputs, USB connections, ICSP header and reset button. This board includes everything you will need](https://www.arduino.cc/en/Main/Software)

for a great rst experience with Arduino.

Industry-standard development board: Using the UNO R3 board in industries, there are a range of companies

[using the UNO R3 board as the brain for their PLC’s.](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a)

Education purposes: Although the UNO R3 board has been with us for about ten years, it is still widely used for

various education purposes and scienti [c projects. The board's high standard and top quality performance makes it](https://www.arduino.cc/en/Main/Software)

[a great resource to capture real time from sensors and to trigger complex laboratory equipment to mention a few](https://create.arduino.cc/editor)

examples.

## [1.2 Related Products](https://store.arduino.cc/)

Arduino Starter Kit

Arduino UNO R4 Minima

Arduino UNO R4 WiFi

Tinkerkit Braccio Robot

## 2 Ratings

## 2.1 Recommended Operating Conditions

### Symbol Description Min Max

Conservative thermal limits for the whole board: -40 °C (-40 °F) 85 °C ( 185 °F)

NOTE: In extreme temperatures, EEPROM, voltage regulator, and the crystal oscillator, might not

work as expected.

## 2.2 Power Consumption

### Symbol [Description](https://create.arduino.cc/editor) Min Typ Max Unit

VINMax [Maximum input voltage from VIN pad](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [6](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [-](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [20](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [V](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a)

VUSBMax Maximum input voltage from USB connector - 5.5 V

PMax [Maximum Power Consumption](https://www.arduino.cc/) - - xx mA

## 3 Functional Overview

## [3.1 Board Topology](https://store.arduino.cc/)

Top view

Board topology

### Ref. Description Ref. Description

X1 Power jack 2.1x5.5mm U1 SPX1117M3-L-5 Regulator

X2 USB B Connector U3 ATMEGA16U2 Module

PC1 EEE-1EA470WP 25V SMD Capacitor U5 LMV358LIST-A.9 IC

PC2 EEE-1EA470WP 25V SMD Capacitor F1 Chip Capacitor, High Density

D1 CGRA4007-G Recti er ICSP Pin header connector (through hole 6)

J-ZU4 ATMEGA328P Module ICSP1 Pin header connector (through hole 6)

Y1 ECS-160-20-4X-DU Oscillator

## 3.2 Processor

The Main Processor is a ATmega328P running at up to 20 MHz. Most of its pins are connected to the external

[headers, however some are reserved for internal communication with the USB Bridge coprocessor.](https://create.arduino.cc/editor)

## 3.3 Power Tree

Power tree

## 4 Board Operation

## 4.1 Getting Started - IDE

If you want to program your UNO R3 while o ffl ine you need to install the Arduino Desktop IDE [1] To connect the

UNO R3 to your computer, you’ll need a USB-B cable. This also provides power to the board, as indicated by the

LED.

## 4.2 Getting Started - Arduino Cloud Editor

[All Arduino boards, including this one, work out-of-the-box on the Arduino Cloud Editor [2], by just installing a](https://www.arduino.cc/en/Main/Software)

simple plugin.

The Arduino Cloud Editor is hosted online, therefore it will always be up-to-date with the latest features and support

for all boards. Follow [[3]](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [to start coding on the browser and upload your sketches onto your board.](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a)

## 4.3 Sample Sketches

[Sample sketches for the UNO R3 can be found either in the “Examples” menu in the Arduino IDE or in the](https://create.arduino.cc/editor)

[“Documentation” section of the Arduino website [4].](https://www.arduino.cc/reference/en/)

## [4.4 Online Resources](https://store.arduino.cc/)

[Now that you have gone through the basics of what you can do with the board you can explore the endless](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending)

possibilities it provides by checking exciting projects on Arduino Project Hub [5], the Arduino Library Reference [6]

and the online Arduino store [7] where you will be able to complement your board with sensors, actuators and

more.

## 5 Connector Pinouts

Pinout

## 5.1 JANALOG

### Pin Function Type Description

## 1 NC NC Not connected

2 IOREF IOREF Reference for digital logic V - connected to 5V

## 3 Reset Reset Reset

4 +3V3 Power +3V3 Power Rail

5 +5V Power +5V Power Rail

## 6 GND Power Ground

## 7 GND Power [Ground](https://create.arduino.cc/editor)

## 8 VIN [Power](https://www.arduino.cc/en/Main/Software) [Voltage Input](https://www.arduino.cc/en/Main/Software)

## 9 A0 Analog/GPIO Analog input 0 /GPIO

## 10 A1 [Analog/GPIO](https://create.arduino.cc/editor) Analog input 1 /GPIO

## 11 A2 [Analog/GPIO](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [Analog input 2 /GPIO](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a)

## 12 A3 [Analog/GPIO](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) Analog input 3 /GPIO

## 13 A4/SDA [Analog input/I2C](https://www.arduino.cc/) [Analog input 4/I2C Data line](https://www.arduino.cc/)

## 14 A5/SCL Analog input/I2C [Analog input 5/I2C Clock line](https://www.arduino.cc/en/Main/Software)

## 5.2 JDIGITAL

### Pin [Function](https://store.arduino.cc/) [Type](https://store.arduino.cc/) [Description](https://www.arduino.cc/)

## 1 D0 Digital/GPIO [Digital pin 0/GPIO](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending)

## 2 D1 Digital/GPIO [Digital pin 1/GPIO](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending)

## 3 D2 Digital/GPIO [Digital pin 2/GPIO](https://www.arduino.cc/reference/en/)

## 4 D3 Digital/GPIO [Digital pin 3/GPIO](https://store.arduino.cc/)

## 5 D4 Digital/GPIO Digital pin 4/GPIO

## 6 D5 Digital/GPIO Digital pin 5/GPIO

## 7 D6 Digital/GPIO Digital pin 6/GPIO

## 8 D7 Digital/GPIO Digital pin 7/GPIO

## 9 D8 Digital/GPIO Digital pin 8/GPIO

## 10 D9 Digital/GPIO Digital pin 9/GPIO

## 11 SS Digital SPI Chip Select

## 12 MOSI Digital SPI1 Main Out Secondary In

## 13 MISO Digital [SPI Main In Secondary Out](https://echa.europa.eu/web/guest/candidate-list-table)

## 14 SCK Digital SPI serial clock output

## 15 [GND](https://echa.europa.eu/web/guest/candidate-list-table) [Power](https://echa.europa.eu/web/guest/candidate-list-table) [Ground](https://echa.europa.eu/web/guest/candidate-list-table)

## 16 AREF Digital Analog reference voltage

## 17 A4/SD4 Digital Analog input 4/I2C Data line (duplicated)

18 A5/SD5 Digital Analog input 5/I2C Clock line (duplicated)

## 5.3 Mechanical Information

## 5.4 Board Outline & Mounting Holes

Board outline

## 6 Certifications

## 6.1 Declaration of Conformity CE DoC (EU)

We declare under our sole responsibility that the products above are in conformity with the essential requirements

of the following EU Directives and therefore qualify for free movement within markets comprising the European

Union (EU) and European Economic Area (EEA).

### ROHS 2 Directive 2011/65/EU

Conforms to: EN50581:2012

### Directive 2014/35/EU. (LVD)

Conforms to: EN 60950-1:2006/A11:2009/A1:2010/A12:2011/AC:2011

### Directive 2004/40/EC & 2008/46/EC & 2013/35/EU, EMF

Conforms to: [EN 62311:2008](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a)

## [6.2 Declaration of Conformity to EU RoHS & REACH 211 01/19/2021](https://www.arduino.cc/en/Main/Software)

[Arduino boards are in compliance with RoHS 2 Directive 2011/65/EU of the European Parliament and RoHS 3](https://create.arduino.cc/editor)

[Directive 2015/863/EU of the Council of 4 June 2015 on the restriction of the use of certain hazardous substances in](https://docs.arduino.cc/arduino-cloud/guides/editor/)

electrical and electronic equipment.

### Substance Maximum limit (ppm)

Lead (Pb) [1000](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending)

Cadmium (Cd) [100](https://www.arduino.cc/reference/en/)

Mercury (Hg) 1000

Hexavalent Chromium (Cr6+) 1000

Poly Brominated Biphenyls (PBB) 1000

Poly Brominated Diphenyl ethers (PBDE) 1000

Bis(2-Ethylhexyl} phthalate (DEHP) 1000

Benzyl butyl phthalate (BBP) 1000

Dibutyl phthalate (DBP) 1000

Diisobutyl phthalate (DIBP) 1000

Exemptions: No exemptions are claimed.

Arduino Boards are fully compliant with the related requirements of European Union Regulation (EC) 1907 /2006

concerning the Registration, Evaluation, Authorization and Restriction of Chemicals (REACH). We declare none of the

SVHCs ([https://echa.europa.eu/web/guest/candidate-list-table](https://echa.europa.eu/web/guest/candidate-list-table)), the Candidate List of Substances of Very High

Concern for authorization currently released by ECHA, is present in all products (and also package) in quantities

totaling in a concentration equal or above 0.1%. To the best of our knowledge, we also declare that our products do

not contain any of the substances listed on the "Authorization List" (Annex XIV of the REACH regulations) and

Substances of Very High Concern (SVHC) in any signi cant amounts as speci ed by the Annex XVII of Candidate list

published by ECHA (European Chemical Agency) 1907 /2006/EC.

## 6.3 Conflict Minerals Declaration

As a global supplier of electronic and electrical components, Arduino is aware of our obligations with regards to

laws and regulations regarding Con fl ict Minerals, speci cally the Dodd-Frank Wall Street Reform and Consumer

Protection Act, Section 1502. Arduino does not directly source or process con fl ict minerals such as Tin, Tantalum,

Tungsten, or Gold. Con fl [ict minerals are contained in our products in the form of solder, or as a component in metal](https://www.arduino.cc/en/Main/Software)

alloys. As part of our reasonable due diligence Arduino has contacted component suppliers within our supply chain

to verify their continued compliance with the regulations. Based on the information received thus far we declare

that our products contain Con fl ict Minerals sourced from con fl ict-free areas.

## 7 FCC Caution

Any Changes or modi cations not expressly approved by the party responsible for compliance could void the user’s

authority to operate the equipment.

This device complies with part 15 of the FCC Rules. Operation is subject to the following two conditions:

(1) This device may not cause harmful interference

(2) this device must accept any interference received, including interference that may cause undesired operation.

FCC RF Radiation Exposure Statement:

1. [1. This Transmitter must not be co-located or operating in conjunction with any other antenna or transmitter.](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending)

2. [2. This equipment complies with RF radiation exposure limits set forth for an uncontrolled environment.](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending)

## [3. This equipment should be installed and operated with minimum distance 20cm between the radiator & your](https://store.arduino.cc/)

body.

English: User manuals for license-exempt radio apparatus shall contain the following or equivalent notice in a

conspicuous location in the user manual or alternatively on the device or both. This device complies with Industry

Canada license-exempt RSS standard(s). Operation is subject to the following two conditions:

(1) this device may not cause interference

(2) this device must accept any interference, including interference that may cause undesired operation of the

device.

[French: Le présent appareil est conforme aux CNR d’Industrie Canada applicables aux appareils radio exempts de](https://echa.europa.eu/web/guest/candidate-list-table)

licence. L’exploitation est autorisée aux deux conditions suivantes :

(1) l’ appareil nedoit pas produire de brouillage

(2) l’utilisateur de l’appareil doit accepter tout brouillage radioélectrique subi, même si le brouillage est susceptible

d’en compromettre le fonctionnement.

IC SAR Warning:

English This equipment should be installed and operated with minimum distance 20 cm between the radiator and

your body.

French: Lors de l’ installation et de l’ exploitation de ce dispositif, la distance entre le radiateur et le corps est d ’au

moins 20 cm.

Important: The operating temperature of the EUT can’t exceed 85 ℃ and shouldn’t be lower than -40 ℃ .

Hereby, Arduino S.r.l. declares that this product is in compliance with essential requirements and other relevant

provisions of Directive 2014/53/EU. This product is allowed to be used in all EU member states.

## 8 Company Information

### Company name [Arduino S.r.l](https://www.arduino.cc/en/Main/Software)

Company Address Via Andrea Appiani 25 20900 MONZA Italy

## [9 Reference Documentation](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a)

### Reference [Link](https://www.arduino.cc/)

Arduino IDE (Desktop) [https://www.arduino.cc/en/Main/Software](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending)

Arduino Cloud Editor [https://create.arduino.cc/editor](https://create.arduino.cc/editor)

Arduino Cloud Editor - Getting [https://docs.arduino.cc/arduino-cloud/guides/editor/](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) Started

Arduino Website [https://www.arduino.cc/](https://www.arduino.cc/)

[https://create.arduino.cc/projecthub?](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) Arduino Project Hub by=part&part_id=11332&sort=trending

Library Reference [https://www.arduino.cc/reference/en/](https://www.arduino.cc/reference/en/)

Arduino Store [https://store.arduino.cc/](https://store.arduino.cc/)

## 10 Revision History

### Date Revision Changes

25/04/2024 3 Updated link to new Cloud Editor

26/07/2023 2 General Update

06/2021 1 Datasheet release

# 中 ⽂ (ZH)

# 描 述

Arduino UNO R3 是 熟 悉 电 ⼦ 技 术 和 编 码 的 完 美 开 发 板 。 这 款 多 功 能 开 发 板 配 备 了 著 名 的 ATmega328P 和 ATMega 16U2

处 理 器 。 该 开 发 板 将 为 您 带 来 Arduino 世 界 绝 佳 的 初 次 体 验 。

# ⽬ 标 领 域 ：

创 客 、 介 绍 、 ⼯ 业 领 域

# 特 点

### ATMega328P 处 理 [器](https://www.arduino.cc/)

内 存

AVR CPU [频](https://www.arduino.cc/reference/en/) [率](https://www.arduino.cc/reference/en/) [⾼](https://www.arduino.cc/reference/en/) [达](https://www.arduino.cc/reference/en/) [16 MHz](https://www.arduino.cc/reference/en/)

## 32KB 闪 存

## [2KB SRAM](https://store.arduino.cc/)

## 1KB EEPROM

安 全 性

## 上 电 复 位 (POR)

## ⽋ 压 检 测 (BOD)

外 设

2x 8 位 定 时 器 / 计 数 器， 带 专 ⽤ 周 期 寄存 器 和 ⽐ 较 通道

1x 16 位 定 时 器 / 计 数 器， 带 专 ⽤ 周 期 寄存 器 、 输 ⼊ 捕 获 和 ⽐ 较 通道

1x USART ， 带 分 数 波 特 率 发 ⽣ 器 和 起 始 帧 信 号 检 测 功 能

1x 控 制 器 / 外 设 串 ⾏ 外 设 接 ⼝ (SPI)

1x 双 模 控 制 器 / 外 设 I2C

1 个 模 拟 ⽐ 较 器 (AC) ， 带 [可](https://echa.europa.eu/web/guest/candidate-list-table) [扩](https://echa.europa.eu/web/guest/candidate-list-table) [展](https://echa.europa.eu/web/guest/candidate-list-table) [参](https://echa.europa.eu/web/guest/candidate-list-table) [考](https://echa.europa.eu/web/guest/candidate-list-table) [输](https://echa.europa.eu/web/guest/candidate-list-table) [⼊](https://echa.europa.eu/web/guest/candidate-list-table)

看 ⻔ 狗 定 时 器， 带 独 ⽴ 的 ⽚ 上 振 荡 器

## [6](https://echa.europa.eu/web/guest/candidate-list-table) [通道](https://echa.europa.eu/web/guest/candidate-list-table) [PWM](https://echa.europa.eu/web/guest/candidate-list-table)

引 脚 变化 时 的 中 断 和 唤 醒

ATMega16U2 处 理 器

基 于 AVR® RISC 的 8 位 微 控 制 器

内 存

## 16 KB ISP 闪 存

## 512B EEPROM

## 512B SRAM

⽤ 于 ⽚ 上 调 试 和 编 程 的 debugWIRE 接 ⼝

电 源

2.7-5.5 伏 特

# ⽬ 录

## 11 电 路 板 简 介

#### 11.1 应 ⽤ ⽰ 例

UNO 电 路 板 是 Arduino 的 旗 舰 产 品 。 ⽆ 论 您 是 初 次 接 触 电 路 板 产 品 ， 还 是 将 UNO ⽤ 作 教 育 或 ⼯ 业 相 关 任 务 的 ⼯ 具 ， UNO

都 能 满 ⾜ 您 的 需 求 。

初 次 接 触 电 ⼦ 技 术 : 如 果 [这](https://www.arduino.cc/) [是](https://www.arduino.cc/) [您](https://www.arduino.cc/) [第](https://www.arduino.cc/) [⼀](https://www.arduino.cc/) [次](https://www.arduino.cc/) [参](https://www.arduino.cc/) [与](https://www.arduino.cc/) [编](https://www.arduino.cc/) [码](https://www.arduino.cc/) [和](https://www.arduino.cc/) 电 ⼦ 技 术 项 ⽬ ， 那 么 就 从 我 们 最 常 ⽤ 、 记 录 最 多 的 电 路 板 Arduino UNO

开 始 吧 。 它 配 备 了 著 名 的 ATmega328P 处 [理](https://www.arduino.cc/en/Main/Software) [器](https://www.arduino.cc/en/Main/Software) [、](https://www.arduino.cc/en/Main/Software) [14](https://www.arduino.cc/en/Main/Software) [个](https://www.arduino.cc/en/Main/Software) [数](https://www.arduino.cc/en/Main/Software) [字](https://www.arduino.cc/en/Main/Software) [输](https://www.arduino.cc/en/Main/Software) [⼊](https://www.arduino.cc/en/Main/Software) [/](https://www.arduino.cc/en/Main/Software) [输](https://www.arduino.cc/en/Main/Software) [出](https://www.arduino.cc/en/Main/Software) [引](https://www.arduino.cc/en/Main/Software) [脚](https://www.arduino.cc/en/Main/Software) [、](https://www.arduino.cc/en/Main/Software) [6](https://www.arduino.cc/en/Main/Software) [个](https://www.arduino.cc/en/Main/Software) [模](https://www.arduino.cc/en/Main/Software) [拟](https://www.arduino.cc/en/Main/Software) [输](https://www.arduino.cc/en/Main/Software) ⼊ 、 USB 连 接 、 ICSP 接 头 和 复 位 按

钮 。 该 电 路 板 包 含 了 您 [获](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [得](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [良](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [好](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [的](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [Arduino](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [初](https://create.arduino.cc/editor) [次](https://create.arduino.cc/editor) [体](https://create.arduino.cc/editor) [验](https://create.arduino.cc/editor) [所](https://create.arduino.cc/editor) [需](https://create.arduino.cc/editor) [的](https://create.arduino.cc/editor) [⼀](https://create.arduino.cc/editor) [切](https://create.arduino.cc/editor) [。](https://create.arduino.cc/editor)

** ⾏ 业 标 准 开 发 板 :** [在](https://www.arduino.cc/reference/en/) [⼯](https://www.arduino.cc/reference/en/) [业](https://www.arduino.cc/reference/en/) [领](https://www.arduino.cc/reference/en/) [域](https://www.arduino.cc/reference/en/) [使](https://www.arduino.cc/reference/en/) [⽤](https://www.arduino.cc/reference/en/) [Arduino UNO R3](https://docs.arduino.cc/arduino-cloud/guides/editor/) [开](https://docs.arduino.cc/arduino-cloud/guides/editor/) [发](https://docs.arduino.cc/arduino-cloud/guides/editor/) [板](https://docs.arduino.cc/arduino-cloud/guides/editor/) [，](https://docs.arduino.cc/arduino-cloud/guides/editor/) [有](https://docs.arduino.cc/arduino-cloud/guides/editor/) [许](https://docs.arduino.cc/arduino-cloud/guides/editor/) [多](https://docs.arduino.cc/arduino-cloud/guides/editor/) [公](https://docs.arduino.cc/arduino-cloud/guides/editor/) [司](https://docs.arduino.cc/arduino-cloud/guides/editor/) [使](https://docs.arduino.cc/arduino-cloud/guides/editor/) [⽤](https://docs.arduino.cc/arduino-cloud/guides/editor/) [UNO](https://docs.arduino.cc/arduino-cloud/guides/editor/) [开](https://docs.arduino.cc/arduino-cloud/guides/editor/) [发](https://docs.arduino.cc/arduino-cloud/guides/editor/) [板](https://docs.arduino.cc/arduino-cloud/guides/editor/) [作](https://docs.arduino.cc/arduino-cloud/guides/editor/) 为 其 PLC 的 ⼤ 脑 。

教 育 ⽤ 途 : [尽](https://store.arduino.cc/) [管](https://store.arduino.cc/) [我](https://store.arduino.cc/) [们](https://store.arduino.cc/) [推](https://store.arduino.cc/) [出](https://store.arduino.cc/) UNO R3 电 路 板 已 [有](https://www.arduino.cc/) [⼤](https://www.arduino.cc/) [约](https://www.arduino.cc/) [⼗](https://www.arduino.cc/) [年](https://www.arduino.cc/) [之久](https://www.arduino.cc/) [，](https://www.arduino.cc/) [但](https://www.arduino.cc/) [它](https://www.arduino.cc/) [仍](https://www.arduino.cc/) 被 ⼴ 泛 ⽤ 于 各 种 教 育 ⽤ 途 和 科 学 项 ⽬ 。 该 电 路 板 的 ⾼ 标

准 和 ⼀ 流 性 能 使 其 成 为从 传 感 器 采 集 实 时 数 [据](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [和](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [触](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [发](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [复](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [杂](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [实](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [验](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [室](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [设](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [备](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [等](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [各](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [种](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [应](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [⽤](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [场](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) 合 的 绝 佳 资 源 。

#### 11.2 相 关 产 品

Starter Kit

Arduino UNO R4 Minima

Arduino UNO R4 WiFi

Tinkerkit Braccio Robot

## 12 额 定 值

#### 12.1 建 议 运 ⾏ 条 件

符 号 描 述 最 ⼩ 值 最 ⼤ 值

整 个 电 路 板 的 保 守 温 度 极 限 值 ： -40 °C (-40°F) 85 °C ( 185°F)

注 意 ： 在 极 端 温 度 下 ， EEPROM 、 电 压 调 节 器 和 晶 体 振 荡 器 可 能 ⽆ 法 正 常 ⼯ 作 。

#### 12.2 功 耗

符 号 描 述 最 ⼩ 值 典 型 值 最 ⼤ 值 单 位

VINMax 来 [⾃](https://create.arduino.cc/editor) [VIN](https://create.arduino.cc/editor) [焊](https://create.arduino.cc/editor) [盘的](https://create.arduino.cc/editor) [最](https://create.arduino.cc/editor) [⼤](https://create.arduino.cc/editor) [输](https://create.arduino.cc/editor) [⼊](https://create.arduino.cc/editor) [电](https://create.arduino.cc/editor) [压](https://create.arduino.cc/editor) 6 - 20 V

VUSBMax 来 [⾃](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [USB](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [连](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [接](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [器](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [的](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [最](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [⼤](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [输](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [⼊](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [电](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [压](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [-](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [5.5](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [V](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a)

PMax 最 [⼤](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [功](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [耗](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) - - xx mA

## 13 功 能 概 述

#### 13.1 电 路 板 拓扑 [结](https://store.arduino.cc/) [构](https://store.arduino.cc/)

俯 视 图

### 电 路 板 拓扑 结 构

编 号 描 述 编 号 描 述

X1 电 源 插 孔 2.1x5.5 毫 ⽶ U1 SPX1117M3-L-5 调 节 器

编 号 描 述 编 号 描 述

X2 USB B 连 接 器 U3 ATMEGA16U2 模 块

## PC1 EEE-1EA470WP 25V SMD 电 容 器 U5 LMV358LIST-A.9 IC

PC2 EEE-1EA470WP 25V SMD 电 容 器 F1 ⽚ 式 电 容 器， ⾼ 密 度

D1 CGRA4007-G 整 流 器 [ICSP](https://www.arduino.cc/en/Main/Software) [引](https://www.arduino.cc/en/Main/Software) [脚](https://www.arduino.cc/en/Main/Software) [接](https://www.arduino.cc/en/Main/Software) [头](https://www.arduino.cc/en/Main/Software) 连 接 器（ 通 过 6 号 孔 ）

J-ZU4 ATMEGA328P 模 块 ICSP1 引 脚 接 头 连 接 器（ 通 过 6 号 孔 ）

## Y1 ECS-160-20-4X-DU 振 荡 器

#### 13.2 处 理 器

主 处 理 器 是 ATmega328P [，](https://www.arduino.cc/en/Main/Software) [运](https://www.arduino.cc/en/Main/Software) [⾏](https://www.arduino.cc/en/Main/Software) [频](https://www.arduino.cc/en/Main/Software) [率](https://www.arduino.cc/en/Main/Software) [⾼](https://www.arduino.cc/en/Main/Software) [达](https://www.arduino.cc/en/Main/Software) [20 MHz](https://www.arduino.cc/en/Main/Software) [。](https://www.arduino.cc/en/Main/Software) [它](https://www.arduino.cc/en/Main/Software) [的](https://www.arduino.cc/en/Main/Software) [⼤](https://www.arduino.cc/en/Main/Software) [部](https://www.arduino.cc/en/Main/Software) [分](https://www.arduino.cc/en/Main/Software) [引](https://www.arduino.cc/en/Main/Software) [脚](https://www.arduino.cc/en/Main/Software) 都 与 外 部 接 头 相 连 ， 但 也 有 ⼀ 些 引 脚 ⽤ 于与 USB 桥 协

处 理 器 进 ⾏ 内 部通 信 。

#### 13.3 电 源 树

### 电 源 树

## 14 电 路 板 操 作

#### 14.1 ⼊ ⻔ 指 南 - IDE

如 需 在 离 线 状 态 下 对 Arduino UNO R3 进 ⾏ 编 程 ， 则 需 要 安 装 Arduino Desktop IDE [1] 若 要 将 Arduino UNO 连 接 到 计 算

机 ， 需 要 使 ⽤ USB-B 电 缆 。 如 LED 指 ⽰ 灯 所 ⽰ ， 该 电 缆 还 可 以 为 电 路 板 供 电 。

#### 14.2 ⼊ ⻔ 指 南 - Arduino Cloud Editor

包 括 本 电 路 板 在 内 的 所 有 Arduino 电 路 板 ， 都 可 以 在 Arduino Cloud Editor [2] 上 开 箱 即 ⽤ ， 只 需 安 装 ⼀ 个 简 单 的 插 件 即

### 可 。

Arduino Cloud Editor [是](https://create.arduino.cc/editor) [在](https://create.arduino.cc/editor) [线](https://create.arduino.cc/editor) [托](https://create.arduino.cc/editor) [管](https://create.arduino.cc/editor) [的](https://create.arduino.cc/editor) [，](https://create.arduino.cc/editor) [因](https://create.arduino.cc/editor) [此](https://create.arduino.cc/editor) [它](https://create.arduino.cc/editor) [将](https://create.arduino.cc/editor) [始](https://create.arduino.cc/editor) [终](https://create.arduino.cc/editor) [提](https://create.arduino.cc/editor) [供](https://create.arduino.cc/editor) 最 新 功 能 并 ⽀ 持 所 有 电 路 板 。 接 下 来 **[3]** 开 始 在 浏 览 器 上 编 码

并 将 程 序 上 传 到 您 的 电 路 板 上 。

#### 14.3 ⽰ 例 程 序

Arduino UNO R3 的 ⽰ 例 程 序 可 以 在 [Arduino IDE](https://www.arduino.cc/en/Main/Software) [的](https://www.arduino.cc/en/Main/Software) [“](https://www.arduino.cc/en/Main/Software) [⽰](https://www.arduino.cc/en/Main/Software) [例](https://www.arduino.cc/en/Main/Software) [”](https://www.arduino.cc/en/Main/Software) [菜](https://www.arduino.cc/en/Main/Software) [单](https://www.arduino.cc/en/Main/Software) [或](https://www.arduino.cc/en/Main/Software) [Arduino](https://www.arduino.cc/en/Main/Software) [⽹](https://www.arduino.cc/en/Main/Software) [站](https://www.arduino.cc/en/Main/Software) [[4]](https://www.arduino.cc/en/Main/Software) [的](https://www.arduino.cc/en/Main/Software) [“](https://www.arduino.cc/en/Main/Software) ⽂ 档 ” 部 分 找 到

#### 14.4 在 线 资 源

现 在 ， 您 已 经 了 解 该 电 [路](https://store.arduino.cc/) [板](https://store.arduino.cc/) [的](https://store.arduino.cc/) [基](https://store.arduino.cc/) [本](https://store.arduino.cc/) [功](https://store.arduino.cc/) [能](https://store.arduino.cc/) [，](https://store.arduino.cc/) [就](https://store.arduino.cc/) [可](https://store.arduino.cc/) [以](https://store.arduino.cc/) 通 过 查 看 Arduino Project Hub **[5]** 、 Arduino Library Reference [6]

以 及 在 线 Arduino 商 店 **[7]** 上 的 精 彩 项 ⽬ 来 探 索 它 所 提 供 的 ⽆ 限 可 能 性 ； 在 这 些 项 ⽬ 中 ， 您 可 以 为 电 路 板 配 备 传 感

### 器 、 执 ⾏ 器 等 。

## 15 连 接 器 引 脚 布 局

### 布 局

## 15.1 JANALOG

引 脚 功 能 类 型 描 述

## 1 NC NC 未 连 接

## 2 IOREF IOREF 数 [字](https://www.arduino.cc/en/Main/Software) [逻](https://www.arduino.cc/en/Main/Software) [辑](https://www.arduino.cc/en/Main/Software) [参](https://www.arduino.cc/en/Main/Software) [考](https://www.arduino.cc/en/Main/Software) [电](https://www.arduino.cc/en/Main/Software) [压](https://www.arduino.cc/en/Main/Software) [V -](https://www.arduino.cc/en/Main/Software) [连](https://www.arduino.cc/en/Main/Software) 接 ⾄ 5V

3 复 位 复 位 复 位

## 4 +3V3 电 源 +3V3 电 源 轨

## 5 +5V 电 源 +5V 电 源 轨

## 6 GND 电 源 [接](https://create.arduino.cc/editor) [地](https://create.arduino.cc/editor)

## 7 GND 电 源 接 地

## 8 VIN 电 源 电 压 输 ⼊

## 9 A0 [模](https://create.arduino.cc/editor) [拟](https://create.arduino.cc/editor) [/GPIO](https://create.arduino.cc/editor) 模 拟 输 ⼊ 0 / GPIO

## 10 A1 模 拟 /GPIO 模 拟 输 ⼊ 1 / GPIO

## 11 A2 [模](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [拟](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [/GPIO](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [模](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [拟](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [输](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [⼊](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [2 / GPIO](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a)

## 12 A3 模 拟 /GPIO 模 拟 输 ⼊ 3 / GPIO

## 13 A4/SDA 模 拟 输 ⼊ [/I2C](https://www.arduino.cc/en/Main/Software) [模](https://www.arduino.cc/en/Main/Software) [拟](https://www.arduino.cc/en/Main/Software) [输](https://www.arduino.cc/en/Main/Software) [⼊](https://www.arduino.cc/en/Main/Software) [4/I2C](https://www.arduino.cc/en/Main/Software) [数](https://www.arduino.cc/en/Main/Software) [据](https://www.arduino.cc/en/Main/Software) [线](https://www.arduino.cc/en/Main/Software)

## 14 A5/SCL [模](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [拟](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [输](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [⼊](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [/I2C](https://create.arduino.cc/editor) [模](https://create.arduino.cc/editor) [拟](https://create.arduino.cc/editor) [输](https://create.arduino.cc/editor) [⼊](https://create.arduino.cc/editor) [5/I2C](https://create.arduino.cc/editor) [时](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [钟](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [线](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending)

## 15.2 JDIGITAL

引 脚 功 能 类 型 描 述

## 1 D0 数 字 引 脚 [/GPIO](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [数](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [字](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [引](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [脚](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [0/GPIO](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending)

## 2 D1 数 字 引 脚 [/GPIO](https://www.arduino.cc/reference/en/) [数](https://www.arduino.cc/reference/en/) [字](https://www.arduino.cc/reference/en/) [引](https://www.arduino.cc/reference/en/) [脚](https://www.arduino.cc/reference/en/) [1/GPIO](https://www.arduino.cc/reference/en/)

## 3 D2 数 字 引 脚 [/GPIO](https://store.arduino.cc/) [数](https://store.arduino.cc/) [字](https://store.arduino.cc/) 引 脚 2/GPIO

## 4 D3 数 字 引 脚 /GPIO 数 字 引 脚 3/GPIO

## 5 D4 数 字 引 脚 /GPIO 数 字 引 脚 4/GPIO

## 6 D5 数 字 引 脚 /GPIO 数 字 引 脚 5/GPIO

## 7 D6 数 字 引 脚 /GPIO 数 字 引 脚 6/GPIO

## 8 D7 数 字 引 脚 /GPIO 数 字 引 脚 7/GPIO

## 9 D8 数 字 引 脚 /GPIO 数 字 引 脚 8/GPIO

## 10 D9 数 字 引 脚 /GPIO 数 字 引 脚 9/GPIO

## 11 SS 数 字 SPI 芯 ⽚ 选 择

## 12 MOSI 数 字 [SPI1](https://echa.europa.eu/web/guest/candidate-list-table) [主](https://echa.europa.eu/web/guest/candidate-list-table) [输](https://echa.europa.eu/web/guest/candidate-list-table) [出副](https://echa.europa.eu/web/guest/candidate-list-table) [输](https://echa.europa.eu/web/guest/candidate-list-table) [⼊](https://echa.europa.eu/web/guest/candidate-list-table)

## 13 MISO 数 字 SPI 主 输 ⼊ 副 输 出

## 14 [SCK](https://echa.europa.eu/web/guest/candidate-list-table) [数](https://echa.europa.eu/web/guest/candidate-list-table) [字](https://echa.europa.eu/web/guest/candidate-list-table) [SPI](https://echa.europa.eu/web/guest/candidate-list-table) 串 ⾏ 时 钟 输 出

## 15 GND 电 源 接 地

## 16 AREF 数 字 模 拟 参 考 电 压

## 17 A4/SD4 数 字 模 拟 输 ⼊ 4/I2C 数 据 线 （ 重 复 ）

## 18 A5/SD5 数 字 模 拟 输 ⼊ 5/I2C 时 钟 线 （ 重 复 ）

#### 15.3 机 械 层 信 息

#### 15.4 电 路 板 外 形 图 和 安 装 孔

### 电 路 板 外 形 图

## 16 认证

#### 16.1 符 合 性 声 明 CE DoC （ 欧 盟 ）

我 们 在 此 郑 重 声 明 ， 上 述 产 品 符 合 以 下 欧 盟 指 令 的 基 本 要 求 ， 因 此 有 资 格 在 包 括 欧 盟 （ EU ） 和 欧 洲 经 济 区 （ EEA ） 在 内 的

### 市 场 内 ⾃ 由 流 通 。

```
RoHS 2 指 令 2011/65/EU
```

## 符 合 ： [EN50581:2012](https://create.arduino.cc/editor)

## 指 令 2014/35/EU 。 [(LVD)](https://www.arduino.cc/en/Main/Software)

## 符 合 ： EN 60950-1:2006/A11:2009/A1:2010/A12:2011/AC:2011

## 指 令 [2004/40/EC & 2008/46/EC & 2013/35/EU, EMF](https://create.arduino.cc/editor)

## 符 合 ： [EN 62311:2008](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a)

#### 16.2 声 明 符 合 欧 [盟](https://www.arduino.cc/) [RoHS](https://www.arduino.cc/) [和](https://www.arduino.cc/) REACH 211 01/19/2021

Arduino 电 路 板 符 合 欧 [洲](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [议](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [会](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [关](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [于](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [限](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [制](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [在](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [电](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [⼦](https://www.arduino.cc/en/Main/Software) [电](https://www.arduino.cc/en/Main/Software) [⽓](https://www.arduino.cc/en/Main/Software) [设](https://www.arduino.cc/en/Main/Software) [备](https://www.arduino.cc/en/Main/Software) [中](https://www.arduino.cc/en/Main/Software) [使](https://www.arduino.cc/en/Main/Software) [⽤](https://www.arduino.cc/en/Main/Software) [某](https://www.arduino.cc/en/Main/Software) [些](https://www.arduino.cc/en/Main/Software) [有](https://www.arduino.cc/en/Main/Software) [害](https://www.arduino.cc/en/Main/Software) [物](https://www.arduino.cc/en/Main/Software) [质](https://www.arduino.cc/en/Main/Software) [的](https://www.arduino.cc/en/Main/Software) [RoHS 2](https://www.arduino.cc/en/Main/Software) [指](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [令](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [2011/65/EU](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) 和 欧 盟 理 事 会 于

2015 年 6 ⽉ 4 ⽇ 颁 布 的 关 于 限 制 [在](https://www.arduino.cc/) [电](https://www.arduino.cc/) [⼦](https://www.arduino.cc/) [电](https://www.arduino.cc/) [⽓](https://www.arduino.cc/) [设](https://www.arduino.cc/) [备](https://www.arduino.cc/) [中](https://www.arduino.cc/) [使](https://create.arduino.cc/editor) [⽤](https://create.arduino.cc/editor) [某](https://create.arduino.cc/editor) [些](https://create.arduino.cc/editor) [有](https://create.arduino.cc/editor) [害](https://create.arduino.cc/editor) [物](https://create.arduino.cc/editor) [质](https://create.arduino.cc/editor) [的](https://create.arduino.cc/editor) RoHS 3 指 令 2015/863/EU 。

物 质 最 ⼤ 限 [值](https://www.arduino.cc/reference/en/) [(ppm)](https://www.arduino.cc/reference/en/)

铅 (Pb) 1000

镉 (Cd) 100

汞 (Hg) 1000

六 价 铬 （ Cr6+ ） 1000

## 多 溴 联 苯 （ PBB ） 1000

多 溴 联 苯 醚 （ PBDE ） 1000

邻 苯 ⼆ 甲 酸 ⼆ (2- ⼄ 基 ⼰ ) 酯 (DEHP) 1000

邻 苯 ⼆ 甲 酸 丁 苄 酯 (BBP) 1000

邻 苯 ⼆ 甲 酸 ⼆ 丁 酯 （ DBP ） 1000

邻 苯 ⼆ 甲 酸 ⼆ 异 丁 酯 （ DIBP ） 1000

豁 免 ： 未 申 请 任何 豁 免 。

Arduino 电 路 板 完 全 符 合 欧 盟 法 规 (EC) 1907/2006 中 关 于 化 学 品 注 册 、 评 估 、 许 可和 限 制 (REACH) 的 相 关 要 求 。 我 们 声

明 ， 所 有 产 品 （ 包 括 包 装 ） 中 的 SVHC ([https://echa.europa.eu/web/guest/candidate-list-table](https://echa.europa.eu/web/guest/candidate-list-table)), （ 欧 洲 化 学 品 管 理 局 ⽬

前 发 布 的 《 ⾼ 度 关 注 物 质 候 选 授 权 清 单 》 ） 含 量 总 浓 度 均 未 超 过 0.1% 。 据 我 们 所 知 ， 我 们 还 声 明 ， 我 们 的 产 品 不 含 ECHA

（ 欧 洲 化 [学](https://echa.europa.eu/web/guest/candidate-list-table) [品](https://echa.europa.eu/web/guest/candidate-list-table) [管](https://echa.europa.eu/web/guest/candidate-list-table) [理](https://echa.europa.eu/web/guest/candidate-list-table) [局](https://echa.europa.eu/web/guest/candidate-list-table) [）](https://echa.europa.eu/web/guest/candidate-list-table) [1907/2006/EC](https://echa.europa.eu/web/guest/candidate-list-table) [公](https://echa.europa.eu/web/guest/candidate-list-table) [布](https://echa.europa.eu/web/guest/candidate-list-table) [的](https://echa.europa.eu/web/guest/candidate-list-table) [候](https://echa.europa.eu/web/guest/candidate-list-table) [选](https://echa.europa.eu/web/guest/candidate-list-table) [清](https://echa.europa.eu/web/guest/candidate-list-table) [单](https://echa.europa.eu/web/guest/candidate-list-table) [附](https://echa.europa.eu/web/guest/candidate-list-table) [件](https://echa.europa.eu/web/guest/candidate-list-table) [XVII](https://echa.europa.eu/web/guest/candidate-list-table) [中](https://echa.europa.eu/web/guest/candidate-list-table) 规 定 的 “ 授 权 清 单 （ ” REACH 法 规 附 件 XIV ） 和 ⾼ 度 关 注 物

质 (SVHC) 所 列 的 任何 物 质 。

#### 16.3 冲 突 矿 产 声 明

作 为 电 ⼦ 和 电 ⽓ 元 件 的 全 球 供 应 商 ， Arduino 意 识 到 我 们 有 义 务 遵 守 有 关冲 突 矿 产 的 法 律 法 规 ， 特 别 是 《 多 德 - 弗 兰克 华 尔

街 改 ⾰ 与 消 费 者 保 护 法 案 》 第 1502 条 。 Arduino 不 直 接 采 购 或 加 ⼯ 锡 、 钽 、 钨 或 ⾦ 等 冲 突 矿 物 。 冲 突 矿 物 以 焊 料 的 形式 或

作 为 ⾦ 属 合 ⾦ 的 组 成 部 分 存 在 于 我 们 的 产 品 中 。 作 为 我 们 合 理 尽 职 调 查 的 ⼀ 部 分 ， Arduino 已 联 系 供 应 链 中 的 元 件供 应

商 ， 以 核 实 他 们 是 否 始 终 遵 守 法 规 的 相 关 规 定 。 根 据 迄 今 收 到 [的](https://www.arduino.cc/en/Main/Software) [信](https://www.arduino.cc/en/Main/Software) [息](https://www.arduino.cc/en/Main/Software) [，](https://www.arduino.cc/en/Main/Software) [我](https://www.arduino.cc/en/Main/Software) [们](https://www.arduino.cc/en/Main/Software) [声](https://www.arduino.cc/en/Main/Software) [明](https://www.arduino.cc/en/Main/Software) [我](https://www.arduino.cc/en/Main/Software) [们](https://www.arduino.cc/en/Main/Software) 的 产 品 中 含 有来 ⾃ ⾮ 冲 突 地 区 的 冲 突

矿 物 。

## 17 FCC 警 告

任何 未 经 合 规 性 负责 ⽅ 明 确 批 准 的 更 改 或 修 改 都 可 能 导 致 ⽤ ⼾ ⽆ 权 操 作 设 备 。

本 设 备 符 合 FCC 规 则 第 [15](https://create.arduino.cc/editor) [部](https://create.arduino.cc/editor) [分](https://create.arduino.cc/editor) [的](https://create.arduino.cc/editor) [规](https://create.arduino.cc/editor) [定](https://create.arduino.cc/editor) [。](https://create.arduino.cc/editor) [操](https://create.arduino.cc/editor) [作](https://create.arduino.cc/editor) [须](https://create.arduino.cc/editor) [满](https://create.arduino.cc/editor) [⾜](https://create.arduino.cc/editor) [以](https://create.arduino.cc/editor) 下两个 条 件 ：

(1) 此 设 备 不 会 造 成 有 害 [⼲](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a) [扰](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-editor-4b3e4a)

(2) 此 设 备 必 须 接 受 接 收 到 的 任何 ⼲ 扰 ， 包 括 可 能 导 致 不 良 操 作 的 ⼲ 扰 。

FCC 射 频 辐 射 暴 露 声 明 :

1. 此 发 射 器 不 得 与 任何 其 他 [天](https://www.arduino.cc/) [线](https://www.arduino.cc/) [或](https://www.arduino.cc/) [发](https://www.arduino.cc/) [射](https://www.arduino.cc/) [器](https://www.arduino.cc/) [放](https://www.arduino.cc/) [置](https://www.arduino.cc/) 在 同 ⼀ 位 置 或 同 时 运 ⾏ 。

2. 此 设 备 符 合 为 ⾮ [受](https://store.arduino.cc/) [控](https://store.arduino.cc/) [环](https://store.arduino.cc/) [境](https://store.arduino.cc/) [规](https://store.arduino.cc/) [定](https://store.arduino.cc/) [的](https://store.arduino.cc/) [射](https://store.arduino.cc/) [频](https://store.arduino.cc/) [辐](https://store.arduino.cc/) [射](https://store.arduino.cc/) 暴 露 限 值 。

3. 安 装 和 操 作 本 设 备 时 ， 辐 射 源 与 您 [的](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [⾝](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [体](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [之](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [间](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [⾄](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [少](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [应](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [保](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [持](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [20](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [厘](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [⽶](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [的](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [距](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [离](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending) [。](https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending)

English: User manuals for license-exempt radio apparatus shall contain the following or equivalent notice in a

[conspicuous location in the user manual or alternatively on the device or both. This device complies with Industry](https://www.arduino.cc/reference/en/)

[Canada license-exempt RSS standard(s). Operation is subject to the following two conditions:](https://store.arduino.cc/)

(1) this device may not cause interference

(2) this device must accept any interference, including interference that may cause undesired operation of the

device.

French: Le présent appareil est conforme aux CNR d’Industrie Canada applicables aux appareils radio exempts de

licence. L’exploitation est autorisée aux deux conditions suivantes :

(1) l’ appareil nedoit pas produire de brouillage

[(2) l’utilisateur de l’appareil doit accepter tout brouillage radioélectrique subi, même si le brouillage est susceptible](https://echa.europa.eu/web/guest/candidate-list-table)

d’en compromettre le fonctionnement.

IC SAR 警 告 :

English This equipment should be installed and operated with a minimum distance of 20 cm between the radiator

and your body.

French: Lors de l’ installation et de l’ exploitation de ce dispositif, la distance entre le radiateur et le corps est d ’au

moins 20 cm.

重 要 提 ⽰ ： EUT 的 ⼯ 作 温 度 不 能 超 过 85°C ， 也不 能 低 于 -40°C 。

Arduino S.r.l. 特 此 声 明 ， 本 产 品 符 合 2014/53/EU 指 令 的 基 本 要 求 和 其 他 相 关 规 定 。 本 产 品 允 许 在 所 有 欧 盟 成 员 国 使 ⽤ 。

## 18 公 司 信 息

公 司名 称 Arduino S.r.l

公 司 地址 Via Andrea Appiani 25 20900 MONZA Italy

## 19 参 考 资 料

参 考 资 料 链 接

Arduino IDE [https://www.arduino.cc/en/Main/Software](https://www.arduino.cc/en/Main/Software) (Desktop)

Arduino IDE [https://create.arduino.cc/editor](https://create.arduino.cc/editor) (Cloud)

Cloud IDE ⼊ ⻔ 指 [https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-](https://create.arduino.cc/projecthub/Arduino_Genuino/getting-started-with-arduino-web-) 南 editor-4b3e4a

Arduino ⽹ 站 [https://www.arduino.cc/](https://www.arduino.cc/)

Arduino Project [https://create.arduino.cc/projecthub?by=part&part_id=11332&sort=trending](https://create.arduino.cc/editor) Hub

库 参 考 [https://www.arduino.cc/reference/en/](https://docs.arduino.cc/arduino-cloud/guides/editor/)

在 线 商 店 [https://store.arduino.cc/](https://store.arduino.cc/)

## 20 修 订记 录

⽇ 期 版 次 变 更

2023/07/26 2 ⼀ 般 更 新

2021/06 1 数 据 表 发 布