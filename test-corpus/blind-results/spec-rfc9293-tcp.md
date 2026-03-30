---
title: "Transmission Control Protocol (TCP)"
---

| Stream:    | Internet Engineering Task Force (IETF) |
| ---------- | -------------------------------------- |
| STD:       | 7                                      |
| RFC:       | 9293                                   |
| Obsoletes: | 793, 879, 2873, 6093, 6429, 6528, 6691 |
| Updates:   | 1011, 1122, 5961                       |
| ISSN:      | 2070-1721                              |
| Author:    | W. Eddy, Ed.                           |

# [Transmission Control Protocol (TCP)](https://doi.org/10.1016/0376-5075(78)90053-3)

## Abstract

[This document specifies the Transmission Control Protocol (TCP). TCP is an important transport-](https://www.rfc-editor.org/info/rfc2914) [layer protocol in the Internet protocol stack, and it has continuously evolved over decades of use](https://www.rfc-editor.org/info/rfc7094) and growth of the Internet. Over this time, a number of changes have been made to TCP as it was [specified in RFC 793, though these have only been documented in a piecemeal fashion. This](https://www.rfc-editor.org/info/rfc9000) [document collects and brings those changes together with the protocol specification from RFC](https://www.rfc-editor.org/info/rfc3168) [793. This document obsoletes RFC 793, as well as RFCs 879, 2873, 6093, 6429, 6528, and 6691 that](https://www.rfc-editor.org/info/rfc7323) updated parts of RFC 793. It updates RFCs 1011 and 1122, and it should be considered as a replacement for the portions of those documents dealing with TCP requirements. It also updates [RFC 5961 by adding a small clarification in reset handling while in the SYN-RECEIVED state. The](https://www.rfc-editor.org/info/rfc5044) TCP header control bits from RFC 793 have also been updated based on RFC 3168.

## Status of This Memo

[This is an Internet Standards Track document.](https://www.rfc-editor.org/info/rfc5961)

[This document is a product of the Internet Engineering Task Force (IETF). It represents the](https://www.rfc-editor.org/info/rfc7657) consensus of the IETF community. It has received public review and has been approved for [publication by the Internet Engineering Steering Group (IESG). Further information on Internet](https://www.rfc-editor.org/info/rfc5795) [Standards is available in Section 2 of RFC 7841.](https://www.rfc-editor.org/info/rfc8087)

[Information about the current status of this document, any errata, and how to provide feedback](https://www.rfc-editor.org/info/rfc9293) [on it may be obtained at](https://www.rfc-editor.org/rfc/rfc8095#section-3.1) [https://www.rfc-editor.org/info/rfc9293](https://www.rfc-editor.org/info/rfc9293) [.](https://www.rfc-editor.org/errata/eid1564)

## Copyright Notice

Copyright (c) 2022 IETF Trust and the persons identified as the document authors. All rights reserved.

[This document is subject to BCP 78 and the IETF Trust's Legal Provisions Relating to IETF](https://trustee.ietf.org/license-info) Documents ( [https://trustee.ietf.org/license-info](https://www.rfc-editor.org/info/rfc2883) ) in effect on the date of publication of this [document. Please review these documents carefully, as they describe your rights and restrictions](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) with respect to this document. Code Components extracted from this document must include Revised BSD License text as described in Section 4.e of the Trust Legal Provisions and are [provided without warranty as described in the Revised BSD License.](https://www.rfc-editor.org/info/rfc8201)

This document may contain material from IETF Documents or IETF Contributions published or made publicly available before November 10, 2008. The person(s) controlling the copyright in [some of this material may not have granted the IETF Trust the right to allow modifications of](https://www.rfc-editor.org/info/rfc1191) [such material outside the IETF Standards Process. Without obtaining an adequate license from](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) the person(s) controlling the copyright in such materials, this document may not be modified [outside the IETF Standards Process, and derivative works of it may not be created outside the](https://www.rfc-editor.org/info/rfc8548) IETF Standards Process, except to format it for publication as an RFC or to translate it into languages other than English.

## Table of Contents

## 1. Purpose and Scope

## 2. Introduction

### [2.1. Requirements Language](https://www.rfc-editor.org/errata/eid3301)

### 2.2. Key TCP Concepts

## 3. Functional Specification

### 3.1. Header Format

### 3.2. Specific Option Definitions

#### [3.2.1. Other Common Options](https://www.rfc-editor.org/info/rfc1644)

#### 3.2.2. Experimental TCP Options

### [3.3. TCP Terminology Overview](https://www.rfc-editor.org/info/rfc5961)

#### [3.3.1. Key Connection State Variables](https://www.rfc-editor.org/info/rfc7657)

#### [3.3.2. State Machine Overview](https://www.rfc-editor.org/info/rfc6298)

### 3.4. Sequence Numbers

#### [3.4.1. Initial Sequence Number Selection](https://www.rfc-editor.org/info/rfc9293)

#### [3.4.2. Knowing When to Keep Quiet](https://www.rfc-editor.org/errata/eid3602)

#### [3.4.3. The TCP Quiet Time Concept](https://www.rfc-editor.org/info/rfc8174)

### [3.5. Establishing a Connection](https://www.rfc-editor.org/errata/eid1571)

#### 3.5.1. Half-Open Connections and Other Anomalies

#### [3.5.2. Reset Generation](https://trustee.ietf.org/license-info)

#### 3.5.3. Reset Processing

### [3.6. Closing a Connection](https://www.rfc-editor.org/rfc/rfc2525#section-2.17)

#### [3.6.1. Half-Closed Connections](https://www.rfc-editor.org/info/rfc8201)

### [3.7. Segmentation](mailto:wes@mti-systems.com)

#### [3.7.1. Maximum Segment Size Option](https://www.rfc-editor.org/errata/eid2748)

#### [3.7.2. Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc7657#section-5.1)

#### [3.7.3. Interfaces with Variable MTU Values](https://www.rfc-editor.org/info/rfc3465)

#### 3.7.4. Nagle Algorithm

#### [3.7.5. IPv6 Jumbograms](https://doi.org/10.1016/0376-5075(78)90053-3)

### 3.8. Data Communication

#### 3.8.1. Retransmission Timeout

#### [3.8.2. TCP Congestion Control](https://doi.org/10.1109/INFCOM.1999.752180)

#### [3.8.3. TCP Connection Failures](https://www.rfc-editor.org/info/rfc7094)

#### 3.8.4. TCP Keep-Alives

#### [3.8.5. The Communication of Urgent Information](https://www.rfc-editor.org/info/rfc7323)

#### 3.8.6. Managing the Window

### 3.9. Interfaces

#### 3.9.1. User/TCP Interface

#### [3.9.2. TCP/Lower-Level Interface](https://www.iana.org/assignments/tcp-parameters/)

### 3.10. Event Processing

#### 3.10.1. OPEN Call

#### 3.10.2. SEND Call

#### 3.10.3. RECEIVE Call

#### 3.10.4. CLOSE Call

#### 3.10.5. ABORT Call

#### 3.10.6. STATUS Call

#### [3.10.7. SEGMENT ARRIVES](https://www.rfc-editor.org/info/rfc8174)

#### 3.10.8. Timeouts

## 4. Glossary

## [5. Changes from RFC 793](https://trustee.ietf.org/license-info)

## 6. IANA Considerations

## [7. Security and Privacy Considerations](https://www.rfc-editor.org/rfc/rfc1011)

## 8. References

### [8.1. Normative References](mailto:wes@mti-systems.com)

### 8.2. Informative References

[Appendix A. Other Implementation Notes](https://www.rfc-editor.org/rfc/rfc7657#section-5.3)

[A.1. IP Security Compartment and Precedence](https://www.rfc-editor.org/info/rfc3465)

A.1.1. Precedence

A.1.2. MLS Systems

[A.2. Sequence Number Validation](https://www.rfc-editor.org/errata/eid3213)

A.3. Nagle Modification

[A.4. Low Watermark Settings](https://doi.org/10.1109/INFCOM.1999.752180)

[Appendix B. TCP Requirement Summary](https://www.rfc-editor.org/info/rfc7094)

Acknowledgments

Author's Address

## 1. [Purpose and Scope](https://www.rfc-editor.org/info/rfc1644)

In 1981, RFC 793 [16] [was released, documenting the Transmission Control Protocol (TCP) and](https://www.rfc-editor.org/info/rfc7414) replacing earlier published specifications for TCP.

[Since then, TCP has been widely implemented, and it has been used as a transport protocol for](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [numerous applications on the Internet.](https://www.rfc-editor.org/info/rfc7657)

For several decades, RFC 793 plus a number of other documents have combined to serve as the core specification for TCP [[49]](https://www.rfc-editor.org/info/rfc5795) [. Over time, a number of errata have been filed against RFC 793.](https://www.rfc-editor.org/info/rfc2525) [There have also been deficiencies found and resolved in security, performance, and many other](https://www.rfc-editor.org/info/rfc8087) [aspects. The number of enhancements has grown over time across many separate documents.](https://www.rfc-editor.org/info/rfc9293) These were never accumulated together into a comprehensive update to the base specification.

[The purpose of this document is to bring together all of the IETF Standards Track changes and](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [other clarifications that have been made to the base TCP functional specification (RFC 793) and to](https://www.rfc-editor.org/info/rfc2873) unify them into an updated version of the specification.

[Some companion documents are referenced for important algorithms that are used by TCP (e.g.,](https://www.rfc-editor.org/info/rfc5927) [for congestion control) but have not been completely included in this document. This is a](https://www.rfc-editor.org/info/rfc2883) [conscious choice, as this base specification can be used with multiple additional algorithms that](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) are developed and incorporated separately. This document focuses on the common basis that all [TCP implementations must support in order to interoperate. Since some additional TCP features](https://www.rfc-editor.org/info/rfc2923) [have become quite complicated themselves (e.g., advanced loss recovery and congestion control),](https://www.rfc-editor.org/info/rfc6429) [future companion documents may attempt to similarly bring these together.](https://www.rfc-editor.org/info/rfc791)

In addition to the protocol specification that describes the TCP segment format, generation, and [processing rules that are to be implemented in code, RFC 793 and other updates also contain](https://www.rfc-editor.org/info/rfc1191) [informative and descriptive text for readers to understand aspects of the protocol design and](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [operation. This document does not attempt to alter or update this informative text and is focused](https://www.rfc-editor.org/info/rfc6691) [only on updating the normative protocol specification. This document preserves references to](https://www.rfc-editor.org/info/rfc8548) the documentation containing the important explanations and rationale, where appropriate.

[This document is intended to be useful both in checking existing TCP implementations for](https://www.rfc-editor.org/info/rfc8558) conformance purposes, as well as in writing new implementations.

## 2. Introduction

[RFC 793 contains a discussion of the TCP design goals and provides examples of its operation,](https://www.rfc-editor.org/info/rfc7094) including examples of connection establishment, connection termination, and packet retransmission to repair losses.

[This document describes the basic functionality expected in modern TCP implementations and](https://www.rfc-editor.org/info/rfc7323) replaces the protocol specification in RFC 793. It does not replicate or attempt to update the introduction and philosophy content in Sections 1 and 2 of RFC 793. Other documents are [referenced to provide explanations of the theory of operation, rationale, and detailed discussion](https://www.rfc-editor.org/info/rfc5044) of design decisions. This document only focuses on the normative behavior of the protocol.

The "TCP Roadmap" [[49]](https://www.iana.org/assignments/tcp-parameters/) [provides a more extensive guide to the RFCs that define TCP and](https://www.rfc-editor.org/info/rfc7414) describe various important algorithms. The TCP Roadmap contains sections on strongly encouraged enhancements that improve performance and other aspects of TCP beyond the basic [operation specified in this document. As one example, implementing congestion control (e.g.,](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [[8]](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) [)](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) [is a TCP requirement, but it is a complex topic on its own and not described in detail in this](https://www.rfc-editor.org/info/rfc7657) document, as there are many options and possibilities that do not impact basic interoperability. Similarly, most TCP implementations today include the high-performance extensions in [[47]](https://www.rfc-editor.org/info/rfc5795) , but [these are not strictly required or discussed in this document. Multipath considerations for TCP](https://www.rfc-editor.org/info/rfc5795) are also specified separately in [[59]](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4) [.](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4)

[A list of changes from RFC 793 is contained in Section 5.](https://www.rfc-editor.org/info/rfc9293)

### 2.1. [Requirements Language](https://www.rfc-editor.org/rfc/rfc9293)

[The key words "](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [MUST](https://www.rfc-editor.org/rfc/rfc793) [", "](https://www.rfc-editor.org/rfc/rfc879) [MUST NOT](https://www.rfc-editor.org/rfc/rfc2873) ", " [REQUIRED](https://www.rfc-editor.org/rfc/rfc6528) [", "](https://www.rfc-editor.org/rfc/rfc6691) SHALL ", " SHALL NOT ", " SHOULD ", " SHOULD

NOT ", " RECOMMENDED ", " NOT RECOMMENDED [", "](https://www.rfc-editor.org/info/rfc2923) [MAY](https://www.rfc-editor.org/info/rfc2923) [", and "](https://www.rfc-editor.org/info/rfc2923) [OPTIONAL](https://www.rfc-editor.org/info/rfc2923) [" in this document are to](https://www.rfc-editor.org/info/rfc8201) [be interpreted as described in BCP 14](https://www.rfc-editor.org/info/rfc8201) [[3] [12]](https://www.rfc-editor.org/info/rfc6429) [when, and only when, they appear in all capitals, as](https://www.rfc-editor.org/errata/eid2298) shown here.

Each use of RFC 2119 keywords in the document is individually labeled and referenced in Appendix B, which summarizes implementation requirements.

Sentences using " [MUST](https://www.rfc-editor.org/errata/eid2749) " are labeled as "MUST-X" with X being a numeric identifier enabling the requirement to be located easily when referenced from Appendix B.

Similarly, sentences using " SHOULD [" are labeled with "SHLD-X", "](https://www.rfc-editor.org/info/rfc793) [MAY](https://www.rfc-editor.org/info/rfc793) [" with "MAY-X", and](https://www.rfc-editor.org/info/rfc793) " RECOMMENDED [" with "REC-X".](https://doi.org/10.1016/0376-5075(78)90053-3)

[For the purposes of this labeling, "](https://www.rfc-editor.org/errata/eid3213) SHOULD NOT [" and "](https://www.rfc-editor.org/info/rfc2474) [MUST NOT](https://www.rfc-editor.org/info/rfc2474) [" are labeled the same as](https://www.rfc-editor.org/info/rfc2474) " SHOULD " and " MUST " instances.

### 2.2. [Key TCP Concepts](https://doi.org/10.1109/INFCOM.1999.752180)

TCP provides a reliable, in-order, byte-stream service to applications.

[The application byte-stream is conveyed over the network via TCP segments, with each TCP](https://www.rfc-editor.org/info/rfc3168) [segment sent as an Internet Protocol (IP) datagram.](https://www.rfc-editor.org/info/rfc7323)

TCP reliability consists of detecting packet losses (via sequence numbers) and errors (via per- [segment checksums), as well as correction via retransmission.](https://www.rfc-editor.org/info/rfc5044)

TCP supports unicast delivery of data. There are anycast applications that can successfully use [TCP without modifications, though there is some risk of instability due to changes of lower-layer](https://www.rfc-editor.org/info/rfc5461) forwarding behavior [[46]](https://www.rfc-editor.org/errata/eid1565) .

[TCP is connection oriented, though it does not inherently include a liveness detection capability.](https://www.rfc-editor.org/info/rfc5961)

[Data flow is supported bidirectionally over TCP connections, though applications are free to send](https://www.rfc-editor.org/info/rfc7657) [data only unidirectionally, if they so choose.](https://www.rfc-editor.org/errata/eid2296)

[TCP uses port numbers to identify application services and to multiplex distinct flows between](https://www.rfc-editor.org/info/rfc5795) hosts.

[A more detailed description of TCP features compared to other transport protocols can be found](https://www.rfc-editor.org/info/rfc9293) in Section 3.1 of [52] [. Further description of the motivations for developing TCP and its role in the](https://www.rfc-editor.org/errata/eid1564) [Internet protocol stack can be found in](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [Section 2 of [16]](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [and earlier versions of the TCP](https://www.rfc-editor.org/info/rfc8174) specification.

## 3. [Functional Specification](https://www.rfc-editor.org/rfc/rfc879)

### 3.1. Header Format

[TCP segments are sent as internet datagrams. The Internet Protocol (IP) header carries several](https://www.rfc-editor.org/info/rfc6429) [information fields, including the source and destination host addresses](https://www.rfc-editor.org/info/rfc791) [1] [13] . A TCP header follows the IP headers, supplying information specific to TCP. This division allows for the [existence of host-level protocols other than TCP. In the early development of the Internet suite of](https://www.rfc-editor.org/info/rfc1191) [protocols, the IP header fields had been a part of TCP.](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

[This document describes TCP, which uses TCP headers.](https://www.rfc-editor.org/info/rfc3465)

A TCP header, followed by any user data in the segment, is formatted as follows, using the style from [66] :

```
0 1 2 3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| Source Port | Destination Port |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| Sequence Number |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| Acknowledgment Number |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| Data | |C|E|U|A|P|R|S|F| |
| Offset| Rsrvd |W|C|R|C|S|S|Y|I| Window |
| | |R|E|G|K|H|T|N|N| |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| Checksum | Urgent Pointer |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| [Options] |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| :
: Data :
: |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

Note [that](https://www.rfc-editor.org/errata/eid2296) one tick [mark represents one bit position.](https://www.rfc-editor.org/errata/eid1561)

### Figure 1: TCP Header Format

where:

Source Port: [16 bits](https://www.rfc-editor.org/errata/eid3602)

The source port number.

Destination Port: [16 bits](https://www.rfc-editor.org/errata/eid1571)

[The destination port number.](https://trustee.ietf.org/license-info)

Sequence Number: [32 bits](https://www.rfc-editor.org/info/rfc8311)

[The sequence number of the first data octet in this segment (except when the SYN flag is set). If](https://www.rfc-editor.org/info/rfc2923) SYN is set, the sequence number is the initial sequence number (ISN) and the first data octet is ISN+1.

Acknowledgment Number: 32 bits

[If the ACK control bit is set, this field contains the value of the next sequence number the](https://www.rfc-editor.org/info/rfc1191) [sender of the segment is expecting to receive. Once a connection is established, this is always](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) sent.

[Data Offset (DOffset):](https://www.rfc-editor.org/rfc/rfc5570#section-7.3.1) 4 bits

[The number of 32-bit words in the TCP header. This indicates where the data begins. The TCP](https://www.rfc-editor.org/info/rfc8558) header (even one including options) is an integer multiple of 32 bits long.

Reserved (Rsrvd): 4 bits

[A set of control bits reserved for future use. Must be zero in generated segments and must be](https://www.rfc-editor.org/info/rfc2914) [ignored in received segments if the corresponding future features are not implemented by the](https://www.rfc-editor.org/info/rfc7094) sending or receiving host.

Control bits: [The control bits are also known as "flags". Assignment is managed by IANA from](https://www.rfc-editor.org/info/rfc4953) [the "TCP Header Flags" registry](https://www.rfc-editor.org/rfc/rfc5461#section-4) [[62]](https://www.rfc-editor.org/info/rfc7323) [. The currently assigned control bits are CWR, ECE, URG,](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) ACK, PSH, RST, SYN, and FIN.

CWR: 1 bit

[Congestion Window Reduced (see](https://www.rfc-editor.org/info/rfc1644) [6] ).

ECE: 1 bit

ECN-Echo (see [[6]](https://www.rfc-editor.org/info/rfc5961) [).](https://www.rfc-editor.org/info/rfc5961)

URG: 1 bit

[Urgent pointer field is significant.](https://www.rfc-editor.org/info/rfc6298)

ACK: 1 bit

Acknowledgment field is significant.

PSH: 1 bit

[Push function (see the Send Call description in Section 3.9.1).](https://www.rfc-editor.org/info/rfc2873)

RST: 1 bit

[Reset the connection.](https://trustee.ietf.org/license-info)

SYN: 1 bit

Synchronize sequence numbers.

FIN: 1 bit

No more data from sender.

Window: 16 bits

The number of data octets beginning with the one indicated in the acknowledgment field that [the sender of this segment is willing to accept. The value is shifted when the window scaling](https://www.rfc-editor.org/info/rfc6691) [extension is used](https://www.rfc-editor.org/rfc/rfc5570#section-7.3.1) [[47]](https://www.rfc-editor.org/info/rfc2119) [.](https://www.rfc-editor.org/info/rfc2119)

The window size [MUST](https://doi.org/10.1016/0376-5075(78)90053-3) [be treated as an unsigned number, or else large window sizes will](https://www.rfc-editor.org/info/rfc6864) [appear like negative windows and TCP will not work (MUST-1). It is](https://www.rfc-editor.org/info/rfc4727) [RECOMMENDED](https://www.rfc-editor.org/info/rfc8558) [that](https://www.rfc-editor.org/errata/eid3213) [implementations will reserve 32-bit fields for the send and receive window sizes in the](https://www.rfc-editor.org/info/rfc2474) connection record and do all window computations with 32 bits (REC-1).

Checksum: 16 bits

The checksum field is the 16-bit ones' complement of the ones' complement sum of all 16-bit [words in the header and text. The checksum computation needs to ensure the 16-bit alignment](https://www.rfc-editor.org/info/rfc3168) [of the data being summed. If a segment contains an odd number of header and text octets,](https://www.rfc-editor.org/info/rfc4953) [alignment can be achieved by padding the last octet with zeros on its right to form a 16-bit](https://www.rfc-editor.org/info/rfc7323) word for checksum purposes. The pad is not transmitted as part of the segment. While [computing the checksum, the checksum field itself is replaced with zeros.](https://www.rfc-editor.org/info/rfc5044)

The checksum also covers a pseudo-header (Figure 2) conceptually prefixed to the TCP header. [The pseudo-header is 96 bits for IPv4 and 320 bits for IPv6. Including the pseudo-header in the](https://www.rfc-editor.org/info/rfc5461) checksum gives the TCP connection protection against misrouted segments. This information is carried in IP headers and is transferred across the TCP/network interface in the arguments or [results of calls by the TCP implementation on the IP layer.](https://www.rfc-editor.org/info/rfc5961)

```
+--------+--------+--------+--------+
| Source Address |
+--------+--------+--------+--------+
| Destination Address |
+--------+--------+--------+--------+
| zero | PTCL | Length |
+--------+--------+--------+--------+
```

### Figure 2: IPv4 Pseudo-header

[Pseudo-header components for IPv4:](https://www.rfc-editor.org/errata/eid4772) Source Address: [the IPv4 source address in network byte order](https://www.rfc-editor.org/info/rfc8303)

[Destination Address:](https://trustee.ietf.org/license-info) [the IPv4 destination address in network byte order](https://www.rfc-editor.org/info/rfc5927)

zero: [bits set to zero](https://www.rfc-editor.org/rfc/rfc9293)

[PTCL:](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [the protocol number from the IP header](https://www.rfc-editor.org/rfc/rfc5961)

TCP Length: the TCP header length plus the data length in octets (this is not an explicitly [transmitted quantity but is computed), and it does not count the 12 octets of the pseudo-](https://www.rfc-editor.org/info/rfc791) header.

For IPv6, the pseudo-header is defined in Section 8.1 of RFC 8200 [[13]](https://www.rfc-editor.org/info/rfc1191) [and contains the IPv6](https://www.rfc-editor.org/info/rfc1191) [Source Address and Destination Address, an Upper-Layer Packet Length (a 32-bit value](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) otherwise equivalent to TCP Length in the IPv4 pseudo-header), three bytes of zero padding, and a Next Header value, which differs from the IPv6 header value if there are extension [headers present between IPv6 and TCP.](https://www.rfc-editor.org/info/rfc2119)

[The TCP checksum is never optional. The sender](https://doi.org/10.1016/0376-5075(78)90053-3) [MUST](https://www.rfc-editor.org/info/rfc6864) [generate it (MUST-2) and the receiver](https://www.iana.org/assignments/tcp-parameters/) [MUST](https://www.iana.org/assignments/tcp-parameters/) [check it (MUST-3).](https://www.rfc-editor.org/info/rfc4727)

Urgent Pointer: 16 bits

[This field communicates the current value of the urgent pointer as a positive offset from the](https://www.rfc-editor.org/info/rfc2914) [sequence number in this segment. The urgent pointer points to the sequence number of the](https://www.rfc-editor.org/info/rfc7094) octet following the urgent data. This field is only to be interpreted in segments with the URG control bit set.

Options: [[TCP Option]; size(Options) == (DOffset-5)*32; present only when DOffset > 5. Note that](https://www.rfc-editor.org/info/rfc7323) [this size expression also includes any padding trailing the actual options present.](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html)

[Options may occupy space at the end of the TCP header and are a multiple of 8 bits in length.](https://www.rfc-editor.org/info/rfc5044) All options are included in the checksum. An option may begin on any octet boundary. There [are two cases for the format of an option:](https://www.rfc-editor.org/info/rfc1644)

Case 1: A single octet of option-kind.

Case 2: An octet of option-kind (Kind), an octet of option-length, and the actual option-data octets.

The option-length counts the two octets of option-kind and option-length as well as the optiondata octets.

Note that the list of options may be shorter than the Data Offset field might imply. The content [of the header beyond the End of Option List Option](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [MUST](https://www.rfc-editor.org/info/rfc6633) [be header padding of zeros](https://www.rfc-editor.org/info/rfc6633) [(MUST-69).](https://www.rfc-editor.org/rfc/rfc8095#section-3.1)

[The list of all currently defined options is managed by IANA](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [[62]](https://www.rfc-editor.org/info/rfc8095) [, and each option is defined in](https://www.rfc-editor.org/info/rfc8174) other RFCs, as indicated there. That set includes experimental options that can be extended to [support multiple concurrent usages](https://www.rfc-editor.org/info/rfc6093) [45] .

[A given TCP implementation can support any currently defined options, but the following](https://www.rfc-editor.org/info/rfc5927) options MUST [be supported (MUST-4 -- note Maximum Segment Size Option support is also part](https://www.rfc-editor.org/info/rfc2883) of MUST-14 in Section 3.7.1):

### Kind Length [Meaning](https://www.rfc-editor.org/info/rfc2923)

[0](https://www.rfc-editor.org/info/rfc791) [-](https://www.rfc-editor.org/info/rfc791) [End of Option List Option.](https://www.rfc-editor.org/info/rfc791)

1 - [No-Operation.](https://www.rfc-editor.org/rfc/rfc8200#section-8.1)

[2](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [4](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [Maximum Segment Size.](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

### Table 1: Mandatory Option Set

These options are specified in detail in Section 3.2.

A TCP implementation [MUST](https://www.rfc-editor.org/info/rfc4727) [be able to receive a TCP Option in any segment (MUST-5).](https://www.rfc-editor.org/info/rfc8558)

A TCP implementation MUST [(MUST-6) ignore without error any TCP Option it does not](https://www.rfc-editor.org/info/rfc2474) [implement, assuming that the option has a length field. All TCP Options except End of Option](https://www.rfc-editor.org/rfc/rfc6528#section-3) [List Option (EOL) and No-Operation (NOP)](https://www.rfc-editor.org/errata/eid3300) [MUST](https://www.rfc-editor.org/info/rfc2914) [have length fields, including all future options](https://www.rfc-editor.org/info/rfc2914) [(MUST-68). TCP implementations](https://doi.org/10.1109/INFCOM.1999.752180) MUST be prepared to handle an illegal option length (e.g., [zero); a suggested procedure is to reset the connection and log the error cause (MUST-7).](https://www.rfc-editor.org/info/rfc7094)

[Note: There is ongoing work to extend the space available for TCP Options, such as](https://www.rfc-editor.org/info/rfc3168) [65] .

Data: [variable length](https://www.rfc-editor.org/rfc/rfc5461#section-4)

[User data carried by the TCP segment.](https://www.rfc-editor.org/info/rfc5033)

### 3.2. [Specific Option Definitions](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.4.2)

[A TCP Option, in the mandatory option set, is one of an End of Option List Option, a No-Operation](https://www.rfc-editor.org/info/rfc5461) Option, or a Maximum Segment Size Option.

[An End of Option List Option is formatted as follows:](https://www.rfc-editor.org/info/rfc5961)

```
0
0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
| 0 |
+-+-+-+-+-+-+-+-+
```

[where:](https://www.rfc-editor.org/rfc/rfc8095#section-3.1)

Kind: 1 byte; Kind == 0.

[This option code indicates the end of the option list. This might not coincide with the end of the](https://www.rfc-editor.org/info/rfc5927) [TCP header according to the Data Offset field. This is used at the end of all options, not the end](https://www.rfc-editor.org/info/rfc2883) [of each option, and need only be used if the end of the options would not otherwise coincide](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [with the end of the TCP header.](https://www.rfc-editor.org/rfc/rfc2525#section-2.17)

[A No-Operation Option is formatted as follows:](https://www.rfc-editor.org/info/rfc8201)

```
0
0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
| 1 |
+-+-+-+-+-+-+-+-+
```

where:

Kind: 1 byte; Kind == 1.

[This option code can be used between options, for example, to align the beginning of a](https://www.rfc-editor.org/info/rfc2474) [subsequent option on a word boundary. There is no guarantee that senders will use this option,](https://www.rfc-editor.org/rfc/rfc6528#section-3) so receivers [MUST](https://www.rfc-editor.org/errata/eid3300) [be prepared to process options even if they do not begin on a word](https://www.rfc-editor.org/info/rfc2914) boundary (MUST-64).

A Maximum Segment Size Option is formatted as follows:

```
0 1 2 3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| 2 | Length | Maximum Segment Size (MSS) |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

where:

Kind: 1 byte; Kind == 2.

[If this option is present, then it communicates the maximum receive segment size at the TCP](https://www.rfc-editor.org/info/rfc5961) [endpoint that sends this segment. This value is limited by the IP reassembly limit. This field](https://www.rfc-editor.org/info/rfc7657) may be sent in the initial connection request (i.e., in segments with the SYN control bit set) and MUST NOT [be sent in other segments (MUST-65). If this option is not used, any segment size is](https://www.rfc-editor.org/info/rfc2525) [allowed. A more complete description of this option is provided in Section 3.7.1.](https://www.rfc-editor.org/info/rfc5795)

Length: [1 byte; Length == 4.](https://www.rfc-editor.org/errata/eid1562)

Length of the option in bytes.

Maximum Segment Size (MSS): [2 bytes.](https://www.rfc-editor.org/info/rfc2873)

The maximum receive segment size at the TCP endpoint that sends this segment.

#### 3.2.1. [Other Common Options](https://www.rfc-editor.org/info/rfc8200)

[Additional RFCs define some other commonly used options that are recommended to implement](https://www.rfc-editor.org/rfc/rfc6691) for high performance but are not necessary for basic TCP interoperability. These are the TCP Selective Acknowledgment (SACK) Option [[22] [26]](https://www.rfc-editor.org/info/rfc2923) [, TCP Timestamp (TS) Option](https://www.rfc-editor.org/info/rfc2923) [[47]](https://www.rfc-editor.org/info/rfc8201) [, and TCP](https://www.rfc-editor.org/info/rfc8201) Window Scale (WS) Option [[47]](https://www.rfc-editor.org/info/rfc8201) [.](https://www.rfc-editor.org/info/rfc8201)

#### 3.2.2. Experimental TCP Options

[Experimental TCP Option values are defined in](https://www.rfc-editor.org/info/rfc8961) [[30]](https://www.rfc-editor.org/info/rfc1191) [, and](https://www.rfc-editor.org/info/rfc1191) [[45]](https://www.rfc-editor.org/info/rfc1191) [describes the current](https://www.rfc-editor.org/info/rfc1191) [recommended usage for these experimental values.](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

### 3.3. [TCP Terminology Overview](https://www.rfc-editor.org/info/rfc2119)

[This section includes an overview of key terms needed to understand the detailed protocol](https://www.rfc-editor.org/info/rfc793) [operation in the rest of the document. There is a glossary of terms in Section 4.](https://www.rfc-editor.org/info/rfc4727)

#### 3.3.1. [Key Connection State Variables](https://www.rfc-editor.org/errata/eid3213)

[Before we can discuss the operation of the TCP implementation in detail, we need to introduce](https://www.rfc-editor.org/rfc/rfc6528#section-3) [some detailed terminology. The maintenance of a TCP connection requires maintaining state for](https://www.rfc-editor.org/info/rfc2914) [several variables. We conceive of these variables being stored in a connection record called a](https://www.rfc-editor.org/info/rfc7094) Transmission Control Block or TCB. Among the variables stored in the TCB are the local and [remote IP addresses and port numbers, the IP security level, and compartment of the connection](https://www.rfc-editor.org/info/rfc9000) [(see Appendix A.1), pointers to the user's send and receive buffers, pointers to the retransmit](https://www.rfc-editor.org/info/rfc3168) [queue and to the current segment. In addition, several variables relating to the send and receive](https://www.rfc-editor.org/info/rfc7323) [sequence numbers are stored in the TCB.](https://www.rfc-editor.org/rfc/rfc5461#section-4)

### Variable [Description](https://www.rfc-editor.org/info/rfc9065)

SND.UNA [send unacknowledged](https://www.rfc-editor.org/info/rfc5461)

SND.NXT send next

SND.WND [send window](https://www.rfc-editor.org/info/rfc5961)

SND.UP send urgent pointer

SND.WL1 [segment sequence number used for last window update](https://www.rfc-editor.org/info/rfc2525)

SND.WL2 [segment acknowledgment number used for last window update](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04)

[ISS](https://www.rfc-editor.org/rfc/rfc8095#section-3.1) initial send sequence number

### [Table 2: Send Sequence Variables](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

### Variable Description

RCV.NXT [receive next](https://www.rfc-editor.org/info/rfc8303)

### [Variable](https://trustee.ietf.org/license-info) [Description](https://trustee.ietf.org/license-info)

[RCV.WND](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [receive window](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10)

RCV.UP [receive urgent pointer](https://www.rfc-editor.org/info/rfc2923)

[IRS](https://www.rfc-editor.org/info/rfc791) [initial receive sequence number](https://www.rfc-editor.org/info/rfc791)

### Table 3: Receive Sequence Variables

[The following diagrams may help to relate some of these variables to the sequence space.](https://www.rfc-editor.org/info/rfc1191)

1 2 [3](https://www.rfc-editor.org/info/rfc8548) [4](https://www.rfc-editor.org/info/rfc8548) ----------|----------|----------|---------- SND.UNA [SND.NXT](https://www.rfc-editor.org/info/rfc6864) [SND.UNA](https://www.rfc-editor.org/info/rfc793) [+SND.WND](https://www.rfc-editor.org/info/rfc8558)

1 - [old](https://www.rfc-editor.org/errata/eid3213) sequence [numbers that have](https://www.rfc-editor.org/info/rfc896) [been](https://www.rfc-editor.org/info/rfc2474) [acknowledged](https://www.rfc-editor.org/info/rfc2474) 2 - sequence numbers of [unacknowledged](https://www.rfc-editor.org/info/rfc6994) [data](https://www.rfc-editor.org/info/rfc6994) 3 - sequence numbers [allowed for new data transmission](https://www.rfc-editor.org/info/rfc4821) 4 - [future](https://doi.org/10.1109/INFCOM.1999.752180) sequence [numbers](https://www.rfc-editor.org/info/rfc1011) [that are not yet allowed](https://www.rfc-editor.org/info/rfc2914)

### Figure 3: Send Sequence Space

[The send window is the portion of the sequence space labeled 3 in Figure 3.](https://www.rfc-editor.org/info/rfc3168)

## 1 2 [3](https://www.rfc-editor.org/info/rfc1349) [----------|----------|----------](https://www.rfc-editor.org/info/rfc5044) [RCV.NXT](https://www.rfc-editor.org/info/rfc5044) [RCV.NXT](https://www.rfc-editor.org/info/rfc5044) +RCV.WND

1 - [old](https://www.rfc-editor.org/info/rfc1644) [sequence](https://www.iana.org/assignments/tcp-parameters/) [numbers that have](https://www.rfc-editor.org/info/rfc5461) [been](https://www.rfc-editor.org/info/rfc5461) [acknowledged](https://www.rfc-editor.org/info/rfc5461) 2 - [sequence](https://www.iana.org/assignments/tcp-parameters/) [numbers](https://www.iana.org/assignments/tcp-parameters/) allowed for new reception 3 - future sequence numbers [that are not yet allowed](https://www.rfc-editor.org/errata/eid701)

### Figure 4: Receive Sequence Space

[The receive window is the portion of the sequence space labeled 2 in Figure 4.](https://www.rfc-editor.org/info/rfc7657)

[There are also some variables used frequently in the discussion that take their values from the](https://www.rfc-editor.org/info/rfc5795) fields of the current segment.

### [Variable](https://www.rfc-editor.org/info/rfc9293) [Description](https://www.rfc-editor.org/info/rfc9293)

[SEG.SEQ](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [segment sequence number](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

[SEG.ACK](https://www.rfc-editor.org/rfc/rfc5961#section-5) segment acknowledgment number

SEG.LEN [segment length](https://www.rfc-editor.org/info/rfc8303)

### [Variable](https://trustee.ietf.org/license-info) [Description](https://trustee.ietf.org/license-info)

[SEG.WND](https://www.rfc-editor.org/rfc/rfc2873) [segment window](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10)

SEG.UP [segment urgent pointer](https://www.rfc-editor.org/info/rfc2923)

### [Table 4: Current Segment Variables](https://www.rfc-editor.org/info/rfc6429)

#### 3.3.2. State Machine Overview

[A connection progresses through a series of states during its lifetime. The states are: LISTEN,](https://www.rfc-editor.org/info/rfc1191) [SYN-SENT, SYN-RECEIVED, ESTABLISHED, FIN-WAIT-1, FIN-WAIT-2, CLOSE-WAIT, CLOSING,](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) LAST-ACK, TIME-WAIT, and the fictional state CLOSED. CLOSED is fictional because it represents [the state when there is no TCB, and therefore, no connection. Briefly the meanings of the states](https://www.rfc-editor.org/info/rfc6691) are:

[LISTEN -](https://www.iana.org/assignments/tcp-parameters/) [represents waiting for a connection request from any remote TCP peer and port.](https://www.rfc-editor.org/info/rfc8558)

SYN-SENT - [represents waiting for a matching connection request after having sent a](https://www.rfc-editor.org/info/rfc6994) connection request.

SYN-RECEIVED - represents waiting for a confirming connection request acknowledgment after [having both received and sent a connection request.](https://www.rfc-editor.org/info/rfc7094)

ESTABLISHED - represents an open connection, data received can be delivered to the user. The normal state for the data transfer phase of the connection.

FIN-WAIT-1 - [represents waiting for a connection termination request from the remote TCP](https://www.rfc-editor.org/info/rfc1349) peer, or an acknowledgment of the connection termination request previously sent.

FIN-WAIT-2 - represents waiting for a connection termination request from the remote TCP peer.

CLOSE-WAIT - [represents waiting for a connection termination request from the local user.](https://www.rfc-editor.org/info/rfc7414)

CLOSING - represents waiting for a connection termination request acknowledgment from the remote TCP peer.

LAST-ACK - represents waiting for an acknowledgment of the connection termination request previously sent to the remote TCP peer (this termination request sent to the remote TCP peer [already included an acknowledgment of the termination request sent from the remote TCP](https://www.rfc-editor.org/info/rfc5795) peer).

TIME-WAIT - [represents waiting for enough time to pass to be sure the remote TCP peer](https://www.rfc-editor.org/info/rfc9293) received the acknowledgment of its connection termination request and to avoid new [connections being impacted by delayed segments from previous connections.](https://www.rfc-editor.org/rfc/rfc793#section-2)

CLOSED - [represents no connection state at all.](https://www.rfc-editor.org/rfc/rfc5961#section-5)

[A TCP connection progresses from one state to another in response to events. The events are the](https://www.rfc-editor.org/info/rfc5927) [user calls, OPEN, SEND, RECEIVE, CLOSE, ABORT, and STATUS; the incoming segments,](https://www.rfc-editor.org/info/rfc2883) [particularly those containing the SYN, ACK, RST, and FIN flags; and timeouts.](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10)

[The OPEN call specifies whether connection establishment is to be actively pursued, or to be](https://www.rfc-editor.org/info/rfc2923) passively waited for.

[A passive OPEN request means that the process wants to accept incoming connection requests, in](https://www.rfc-editor.org/info/rfc791) contrast to an active OPEN attempting to initiate a connection.

[The state diagram in Figure 5 illustrates only state changes, together with the causing events and](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) resulting actions, but addresses neither error conditions nor actions that are not connected with state changes. In a later section, more detail is offered with respect to the reaction of the TCP [implementation to events. Some state names are abbreviated or hyphenated differently in the](https://www.rfc-editor.org/info/rfc8548) diagram from how they appear elsewhere in the document.

NOTA BENE: [This diagram is only a summary and must not be taken as the total specification.](https://www.rfc-editor.org/info/rfc2474) Many details are not included.

```
+---------+ ---------\ active OPEN
| CLOSED | \ -----------
+---------+<---------\ \ create TCB
| ^ \ \ snd SYN
passive OPEN | | CLOSE \ \
------------ | | ---------- \ \
create TCB | | delete TCB \ \
V | \ \
rcv RST (note 1) +---------+ CLOSE | \
-------------------->| LISTEN | ---------- | |
/ +---------+ delete TCB | |
/ rcv SYN | | SEND | |
/ ----------- | | ------- | V
+--------+ snd SYN,ACK / \ snd SYN +--------+
| |<----------------- ------------------>| |
| SYN | rcv SYN | SYN |
| RCVD |<-----------------------------------------------| SENT |
| | snd SYN,ACK | |
| |------------------ -------------------| |
+--------+ rcv ACK of SYN \ / rcv SYN,ACK +--------+
| -------------- | | -----------
| x | | snd ACK
| V V
| CLOSE +---------+
| ------- | ESTAB |
| snd FIN +---------+
| CLOSE | | rcv FIN
V ------- | | -------
+---------+ snd FIN / \ snd ACK +---------+
| FIN |<---------------- ------------------>| CLOSE |
| WAIT-1 |------------------ | WAIT |
+---------+ rcv FIN \ +---------+
| rcv ACK of FIN ------- | CLOSE |
| -------------- snd ACK | ------- |
V x V snd FIN V
+---------+ +---------+ +---------+
|FINWAIT-2| | CLOSING | | LAST-ACK|
+---------+ +---------+ +---------+
| rcv ACK of FIN | rcv ACK of FIN |
| rcv FIN -------------- | Timeout=2MSL -------------- |
| ------- x V ------------ x V
\ snd ACK +---------+delete TCB +---------+
-------------------->|TIME-WAIT|------------------->| CLOSED |
+---------+ +---------+
```

### [Figure 5: TCP Connection State Diagram](https://www.rfc-editor.org/info/rfc8087)

[The following notes apply to Figure 5:](https://www.rfc-editor.org/errata/eid1562)

Note 1: [The transition from SYN-RECEIVED to LISTEN on receiving a RST is conditional on](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [having reached SYN-RECEIVED after a passive OPEN.](https://www.rfc-editor.org/rfc/rfc5961#section-5)

Note 2: The figure omits a transition from FIN-WAIT-1 to TIME-WAIT if a FIN is received and the local FIN is also acknowledged.

Note 3: [A RST can be sent from any state with a corresponding transition to TIME-WAIT (see](https://www.rfc-editor.org/info/rfc5927) [70] [for rationale). These transitions are not explicitly shown; otherwise, the diagram would](https://www.rfc-editor.org/info/rfc2883) [become very difficult to read. Similarly, receipt of a RST from any state results in a transition](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) to LISTEN or CLOSED, though this is also omitted from the diagram for legibility.

### 3.4. [Sequence Numbers](https://www.rfc-editor.org/info/rfc8201)

A fundamental notion in the design is that every octet of data sent over a TCP connection has a sequence number. Since every octet is sequenced, each of them can be acknowledged. The [acknowledgment mechanism employed is cumulative so that an acknowledgment of sequence](https://www.rfc-editor.org/info/rfc1191) [number X indicates that all octets up to but not including X have been received. This mechanism](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [allows for straightforward duplicate detection in the presence of retransmission. The numbering](https://www.rfc-editor.org/info/rfc6691) [scheme of octets within a segment is as follows: the first data octet immediately following the](https://www.rfc-editor.org/info/rfc8548) header is the lowest numbered, and the following octets are numbered consecutively.

[It is essential to remember that the actual sequence number space is finite, though large. This](https://www.rfc-editor.org/info/rfc8558)

space ranges from 0 to 2 32 [- 1. Since the space is finite, all arithmetic dealing with sequence](https://www.rfc-editor.org/info/rfc2474)

numbers must be performed modulo 2 32 [. This unsigned arithmetic preserves the relationship of](https://www.rfc-editor.org/info/rfc4821)

[sequence numbers as they cycle from 2](https://www.rfc-editor.org/errata/eid3300) 32 [- 1 to 0 again. There are some subtleties to computer](https://www.rfc-editor.org/info/rfc2914) [modulo arithmetic, so great care should be taken in programming the comparison of such values.](https://www.rfc-editor.org/info/rfc1011)

The symbol "=<" means "less than or equal" (modulo 2 [32](https://www.rfc-editor.org/info/rfc4987) [).](https://www.rfc-editor.org/errata/eid3301)

[The typical kinds of sequence number comparisons that the TCP implementation must perform](https://www.rfc-editor.org/info/rfc3168) include:

(a) [Determining that an acknowledgment refers to some sequence number sent but not yet](https://www.rfc-editor.org/info/rfc5044) acknowledged.

(b) Determining that all sequence numbers occupied by a segment have been acknowledged [(e.g., to remove the segment from a retransmission queue).](https://www.rfc-editor.org/info/rfc5461)

(c) Determining that an incoming segment contains sequence numbers that are expected (i.e., that the segment "overlaps" the receive window).

[In response to sending data, the TCP endpoint will receive acknowledgments. The following](https://www.rfc-editor.org/info/rfc5570) [comparisons are needed to process the acknowledgments:](https://www.rfc-editor.org/info/rfc7657)

[SND.UNA = oldest unacknowledged sequence number](https://www.rfc-editor.org/info/rfc5795)

[SND.NXT = next sequence number to be sent](https://www.rfc-editor.org/info/rfc8087)

[SEG.ACK = acknowledgment from the receiving TCP peer (next sequence number expected by](https://www.rfc-editor.org/info/rfc9293) the receiving TCP peer)

[SEG.SEQ = first sequence number of a segment](https://www.rfc-editor.org/rfc/rfc5961#section-5)

SEG.LEN = the number of octets occupied by the data in the segment (counting SYN and FIN)

[SEG.SEQ+SEG.LEN-1 = last sequence number of a segment](https://trustee.ietf.org/license-info)

[A new acknowledgment (called an "acceptable ack") is one for which the inequality below holds:](https://www.rfc-editor.org/info/rfc2883)

## [SND.UNA < SEG.ACK =< SND.NXT](https://www.rfc-editor.org/rfc/rfc1011)

[A segment on the retransmission queue is fully acknowledged if the sum of its sequence number](https://www.rfc-editor.org/info/rfc6429) [and length is less than or equal to the acknowledgment value in the incoming segment.](https://www.rfc-editor.org/info/rfc791)

When data is received, the following comparisons are needed:

[RCV.NXT = next sequence number expected on an incoming segment, and is the left or lower](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [edge of the receive window](https://www.rfc-editor.org/info/rfc3465)

[RCV.NXT+RCV.WND-1 = last sequence number expected on an incoming segment, and is the](https://www.rfc-editor.org/info/rfc8548) [right or upper edge of the receive window](https://www.rfc-editor.org/errata/eid2934)

[SEG.SEQ = first sequence number occupied by the incoming segment](https://www.rfc-editor.org/info/rfc4727)

SEG.SEQ+SEG.LEN-1 = last sequence number occupied by the incoming segment

A segment is judged to occupy a portion of valid receive sequence space if

## [RCV.NXT =< SEG.SEQ < RCV.NXT+RCV.WND](https://www.rfc-editor.org/info/rfc7094)

or

## [RCV.NXT =< SEG.SEQ+SEG.LEN-1 < RCV.NXT+RCV.WND](https://www.rfc-editor.org/info/rfc7323)

[The first part of this test checks to see if the beginning of the segment falls in the window, the](https://www.rfc-editor.org/info/rfc5044) second part of the test checks to see if the end of the segment falls in the window; if the segment passes either part of the test, it contains data in the window.

Actually, it is a little more complicated than this. Due to zero windows and zero-length segments, we have four cases for the acceptability of an incoming segment:

### Segment [Receive](https://www.rfc-editor.org/info/rfc2018) [Test](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) Length [Window](https://www.rfc-editor.org/info/rfc7657)

## 0 [0](https://www.rfc-editor.org/info/rfc6298) [SEG.SEQ = RCV.NXT](https://www.rfc-editor.org/info/rfc2525)

## 0 [>0](https://www.rfc-editor.org/info/rfc8087) [RCV.NXT =< SEG.SEQ < RCV.NXT+RCV.WND](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04)

[>0](https://www.rfc-editor.org/rfc/rfc8095#section-3.1) 0 [not acceptable](https://www.rfc-editor.org/info/rfc9293)

### Segment [Receive](https://trustee.ietf.org/license-info) [Test](https://trustee.ietf.org/license-info) Length [Window](https://www.rfc-editor.org/info/rfc8311)

[>0](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [>0](https://www.rfc-editor.org/errata/eid2297) RCV.NXT =< SEG.SEQ < RCV.NXT+RCV.WND or RCV.NXT =< SEG.SEQ+SEG.LEN-1 < [RCV.NXT+RCV.WND](https://www.rfc-editor.org/info/rfc791)

### [Table 5: Segment Acceptability Tests](https://www.rfc-editor.org/errata/eid2748)

[Note that when the receive window is zero no segments should be acceptable except ACK](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) segments. Thus, it is possible for a TCP implementation to maintain a zero receive window while [transmitting data and receiving ACKs. A TCP receiver](https://www.rfc-editor.org/info/rfc3465) [MUST](https://www.rfc-editor.org/info/rfc6691) [process the RST and URG fields of all](https://www.rfc-editor.org/info/rfc2119) incoming segments, even when the receive window is zero (MUST-66).

[We have taken advantage of the numbering scheme to protect certain control information as](https://www.rfc-editor.org/info/rfc6864) [well. This is achieved by implicitly including some control flags in the sequence space so they can](https://www.rfc-editor.org/info/rfc8558) [be retransmitted and acknowledged without confusion (i.e., one and only one copy of the control](https://www.rfc-editor.org/info/rfc2474) will be acted upon). Control information is not physically carried in the segment data space. [Consequently, we must adopt rules for implicitly assigning sequence numbers to control. The](https://www.rfc-editor.org/info/rfc2914) [SYN and FIN are the only controls requiring this protection, and these controls are used only at](https://www.rfc-editor.org/info/rfc1011) [connection opening and closing. For sequence number purposes, the SYN is considered to occur](https://www.rfc-editor.org/info/rfc7094) [before the first actual data octet of the segment in which it occurs, while the FIN is considered to](https://www.rfc-editor.org/ien/ien177.txt) [occur after the last actual data octet in a segment in which it occurs. The segment length](https://www.rfc-editor.org/info/rfc3168) [(SEG.LEN) includes both data and sequence space-occupying controls. When a SYN is present,](https://www.rfc-editor.org/info/rfc7323) [then SEG.SEQ is the sequence number of the SYN.](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html)

#### 3.4.1. [Initial Sequence Number Selection](https://www.rfc-editor.org/info/rfc5033)

A connection is defined by a pair of sockets. Connections can be reused. New instances of a [connection will be referred to as incarnations of the connection. The problem that arises from](https://www.rfc-editor.org/info/rfc5461) [this is -- "how does the TCP implementation identify duplicate segments from previous](https://www.iana.org/assignments/tcp-parameters/) incarnations of the connection?" This problem becomes apparent if the connection is being [opened and closed in quick succession, or if the connection breaks with loss of memory and is](https://www.rfc-editor.org/info/rfc5961) [then reestablished. To support this, the TIME-WAIT state limits the rate of connection reuse,](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [while the initial sequence number selection described below further protects against ambiguity](https://www.rfc-editor.org/info/rfc7657) about which incarnation of a connection an incoming packet corresponds to.

[To avoid confusion, we must prevent segments from one incarnation of a connection from being](https://www.rfc-editor.org/info/rfc5795) [used while the same sequence numbers may still be present in the network from an earlier](https://www.rfc-editor.org/info/rfc8087) [incarnation. We want to assure this even if a TCP endpoint loses all knowledge of the sequence](https://www.rfc-editor.org/info/rfc9293) numbers it has been using. When new connections are created, an initial sequence number (ISN) [generator is employed that selects a new 32-bit ISN. There are security issues that result if an off-](https://www.rfc-editor.org/rfc/rfc793#section-2) [path attacker is able to predict or guess ISN values](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [[42]](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [.](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

TCP initial sequence numbers are generated from a number sequence that monotonically [increases until it wraps, known loosely as a "clock". This clock is a 32-bit counter that typically](https://www.rfc-editor.org/info/rfc8303) increments at least once every roughly 4 microseconds, although it is neither assumed to be

[realtime nor precise, and need not persist across reboots. The clock component is intended to](https://www.rfc-editor.org/info/rfc5927) [ensure that with a Maximum Segment Lifetime (MSL), generated ISNs will be unique since it](https://www.rfc-editor.org/info/rfc2883) [cycles approximately every 4.55 hours, which is much longer than the MSL. Please note that for](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) modern networks that support high data rates where the connection might start and quickly [advance sequence numbers to overlap within the MSL, it is recommended to implement the](https://www.rfc-editor.org/info/rfc2923) [Timestamp Option as mentioned later in Section 3.4.3.](https://www.rfc-editor.org/info/rfc8201)

A TCP implementation MUST [use the above type of "clock" for clock-driven selection of initial](https://www.rfc-editor.org/errata/eid2748) sequence numbers (MUST-8), and SHOULD [generate its initial sequence numbers with the](https://www.rfc-editor.org/info/rfc8961) expression:

ISN = M + F(localip, localport, remoteip, remoteport, secretkey)

[where M is the 4 microsecond timer, and F() is a pseudorandom function (PRF) of the](https://www.rfc-editor.org/info/rfc8548) [connection's identifying parameters ("localip, localport, remoteip, remoteport") and a secret key](https://www.rfc-editor.org/info/rfc793) ("secretkey") (SHLD-1). F() [MUST NOT](https://doi.org/10.1016/0376-5075(78)90053-3) [be computable from the outside (MUST-9), or an attacker](https://www.iana.org/assignments/tcp-parameters/) could still guess at sequence numbers from the ISN used for some other connection. The PRF [could be implemented as a cryptographic hash of the concatenation of the TCP connection](https://www.rfc-editor.org/info/rfc2474) [parameters and some secret data. For discussion of the selection of a specific hash algorithm and](https://www.rfc-editor.org/rfc/rfc6528#section-3) [management of the secret key data, please see](https://doi.org/10.1109/INFCOM.1999.752180) [Section 3 of [42]](https://www.rfc-editor.org/info/rfc2914) [.](https://www.rfc-editor.org/info/rfc2914)

[For each connection there is a send sequence number and a receive sequence number. The](https://www.rfc-editor.org/info/rfc7094) [initial send sequence number (ISS) is chosen by the data sending TCP peer, and the initial receive](https://www.rfc-editor.org/ien/ien177.txt) [sequence number (IRS) is learned during the connection-establishing procedure.](https://www.rfc-editor.org/info/rfc3168)

[For a connection to be established or initialized, the two TCP peers must synchronize on each](https://www.rfc-editor.org/info/rfc7323) other's initial sequence numbers. This is done in an exchange of connection-establishing [segments carrying a control bit called "SYN" (for synchronize) and the initial sequence numbers.](https://www.rfc-editor.org/info/rfc5044) As a shorthand, segments carrying the SYN bit are also called "SYNs". Hence, the solution requires a suitable mechanism for picking an initial sequence number and a slightly involved handshake to exchange the ISNs.

The synchronization requires each side to send its own initial sequence number and to receive a [confirmation of it in acknowledgment from the remote TCP peer. Each side must also receive the](https://www.rfc-editor.org/info/rfc5961) [remote peer's initial sequence number and send a confirming acknowledgment.](https://www.rfc-editor.org/info/rfc2018)

1) A --> [B](https://www.rfc-editor.org/errata/eid2296) [SYN](https://www.rfc-editor.org/errata/eid2296) my sequence number is X 2) A <-- [B](https://www.rfc-editor.org/info/rfc6298) [ACK](https://www.rfc-editor.org/info/rfc6298) [your](https://www.rfc-editor.org/info/rfc6298) [sequence number is](https://www.rfc-editor.org/info/rfc5795) [X](https://www.rfc-editor.org/info/rfc2525) 3) A <-- [B](https://www.rfc-editor.org/info/rfc8087) [SYN](https://www.rfc-editor.org/info/rfc8087) [my](https://www.rfc-editor.org/info/rfc8087) [sequence](https://www.rfc-editor.org/info/rfc8087) [number](https://www.rfc-editor.org/info/rfc8087) is Y 4) A --> [B](https://www.rfc-editor.org/info/rfc8087) [ACK](https://www.rfc-editor.org/info/rfc8087) [your](https://www.rfc-editor.org/info/rfc8087) [sequence number is](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4) [Y](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04)

[Because steps 2 and 3 can be combined in a single message this is called the three-way (or three](https://www.rfc-editor.org/info/rfc9293) message) handshake (3WHS).

[A 3WHS is necessary because sequence numbers are not tied to a global clock in the network,](https://www.rfc-editor.org/info/rfc2873) and TCP implementations may have different mechanisms for picking the ISNs. The receiver of [the first SYN has no way of knowing whether the segment was an old one or not, unless it](https://www.rfc-editor.org/info/rfc8303)

[remembers the last sequence number used on the connection (which is not always possible), and](https://www.rfc-editor.org/info/rfc5927) [so it must ask the sender to verify this SYN. The three-way handshake and the advantages of a](https://www.rfc-editor.org/info/rfc2883) [clock-driven scheme for ISN selection are discussed in](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [[69]](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [.](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10)

#### 3.4.2. Knowing When to Keep Quiet

[A theoretical problem exists where data could be corrupted due to confusion between old](https://www.rfc-editor.org/info/rfc6429) [segments in the network and new ones after a host reboots if the same port numbers and](https://www.rfc-editor.org/info/rfc791) sequence space are reused. The "quiet time" concept discussed below addresses this, and the [discussion of it is included for situations where it might be relevant, although it is not felt to be](https://www.rfc-editor.org/info/rfc1191) [necessary in most current implementations. The problem was more relevant earlier in the](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) history of TCP. In practical use on the Internet today, the error-prone conditions are sufficiently [unlikely that it is safe to ignore. Reasons why it is now negligible include: (a) ISS and ephemeral](https://www.rfc-editor.org/info/rfc6691) [port randomization have reduced likelihood of reuse of port numbers and sequence numbers](https://www.rfc-editor.org/info/rfc8548) [after reboots, (b) the effective MSL of the Internet has declined as links have become faster, and](https://www.rfc-editor.org/info/rfc793) [(c) reboots often taking longer than an MSL anyways.](https://doi.org/10.1016/0376-5075(78)90053-3)

[To be sure that a TCP implementation does not create a segment carrying a sequence number](https://www.rfc-editor.org/info/rfc2474) that may be duplicated by an old segment remaining in the network, the TCP endpoint must keep [quiet for an MSL before assigning any sequence numbers upon starting up or recovering from a](https://www.rfc-editor.org/rfc/rfc6528#section-3) [situation where memory of sequence numbers in use was lost. For this specification the MSL is](https://www.rfc-editor.org/info/rfc2914) [taken to be 2 minutes. This is an engineering choice, and may be changed if experience indicates](https://www.rfc-editor.org/info/rfc7094) [it is desirable to do so. Note that if a TCP endpoint is reinitialized in some sense, yet retains its](https://www.rfc-editor.org/ien/ien177.txt) [memory of sequence numbers in use, then it need not wait at all; it must only be sure to use](https://www.rfc-editor.org/info/rfc3168) sequence numbers larger than those recently used.

#### 3.4.3. The TCP Quiet Time Concept

[Hosts that for any reason lose knowledge of the last sequence numbers transmitted on each](https://www.rfc-editor.org/info/rfc5044) active (i.e., not closed) connection shall delay emitting any TCP segments for at least the agreed MSL in the internet system that the host is a part of. In the paragraphs below, an explanation for [this specification is given. TCP implementers may violate the "quiet time" restriction, but only at](https://www.rfc-editor.org/info/rfc5461) the risk of causing some old data to be accepted as new or new data rejected as old duplicated data by some receivers in the internet system.

[TCP endpoints consume sequence number space each time a segment is formed and entered into](https://www.rfc-editor.org/info/rfc7657) the network output queue at a source host. The duplicate detection and sequencing algorithm in TCP relies on the unique binding of segment data to sequence space to the extent that sequence

[numbers will not cycle through all 2](https://www.rfc-editor.org/info/rfc5795) [32](https://www.rfc-editor.org/info/rfc5795) [values before the segment data bound to those sequence](https://www.rfc-editor.org/info/rfc2525) [numbers has been delivered and acknowledged by the receiver and all duplicate copies of the](https://www.rfc-editor.org/info/rfc8087) [segments have "drained" from the internet. Without such an assumption, two distinct TCP](https://www.rfc-editor.org/info/rfc9293) segments could conceivably be assigned the same or overlapping sequence numbers, causing [confusion at the receiver as to which data is new and which is old. Remember that each segment](https://www.rfc-editor.org/rfc/rfc793#section-2) [is bound to as many consecutive sequence numbers as there are octets of data and SYN or FIN](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) flags in the segment.

[Under normal conditions, TCP implementations keep track of the next sequence number to emit](https://www.rfc-editor.org/info/rfc5927) [and the oldest awaiting acknowledgment so as to avoid mistakenly reusing a sequence number](https://www.rfc-editor.org/info/rfc2883) [before its first use has been acknowledged. This alone does not guarantee that old duplicate data](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) is drained from the net, so the sequence space has been made large to reduce the probability that [a wandering duplicate will cause trouble upon arrival. At 2 megabits/sec., it takes 4.5 hours to use](https://www.rfc-editor.org/info/rfc2923)

up 2 32 octets of sequence space. Since the maximum segment lifetime in the net is not likely to [exceed a few tens of seconds, this is deemed ample protection for foreseeable nets, even if data](https://www.rfc-editor.org/info/rfc791) rates escalate to 10s of megabits/sec. At 100 megabits/sec., the cycle time is 5.4 minutes, which [may be a little short but still within reason. Much higher data rates are possible today, with](https://www.rfc-editor.org/info/rfc1191) [implications described in the final paragraph of this subsection.](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

The basic duplicate detection and sequencing algorithm in TCP can be defeated, however, if a [source TCP endpoint does not have any memory of the sequence numbers it last used on a given](https://www.rfc-editor.org/info/rfc8548) [connection. For example, if the TCP implementation were to start all connections with sequence](https://www.rfc-editor.org/info/rfc793) [number 0, then upon the host rebooting, a TCP peer might re-form an earlier connection](https://www.rfc-editor.org/info/rfc6864) [(possibly after half-open connection resolution) and emit packets with sequence numbers](https://www.rfc-editor.org/info/rfc8558) [identical to or overlapping with packets still in the network, which were emitted on an earlier](https://www.rfc-editor.org/info/rfc2474) incarnation of the same connection. In the absence of knowledge about the sequence numbers [used on a particular connection, the TCP specification recommends that the source delay for MSL](https://www.rfc-editor.org/rfc/rfc6528#section-3) [seconds before emitting segments on the connection, to allow time for segments from the earlier](https://www.rfc-editor.org/info/rfc1011) [connection incarnation to drain from the system.](https://www.rfc-editor.org/info/rfc7094)

[Even hosts that can remember the time of day and use it to select initial sequence number values](https://www.rfc-editor.org/info/rfc3168) [are not immune from this problem (i.e., even if time of day is used to select an initial sequence](https://www.rfc-editor.org/info/rfc4953) [number for each new connection incarnation).](https://www.rfc-editor.org/rfc/rfc5461#section-4)

Suppose, for example, that a connection is opened starting with sequence number S. Suppose [that this connection is not used much and that eventually the initial sequence number function](https://www.rfc-editor.org/info/rfc5044) (ISN(t)) takes on a value equal to the sequence number, say S1, of the last segment sent by this [TCP endpoint on a particular connection. Now suppose, at this instant, the host reboots and](https://www.rfc-editor.org/info/rfc5461) establishes a new incarnation of the connection. The initial sequence number chosen is S1 = ISN(t) -- last used sequence number on old incarnation of connection! If the recovery occurs [quickly enough, any old duplicates in the net bearing sequence numbers in the neighborhood of](https://www.rfc-editor.org/info/rfc5961) [S1 may arrive and be treated as new packets by the receiver of the new incarnation of the](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) connection.

The problem is that the recovering host may not know for how long it was down between [rebooting nor does it know whether there are still old duplicates in the system from earlier](https://www.rfc-editor.org/info/rfc5795) connection incarnations.

[One way to deal with this problem is to deliberately delay emitting segments for one MSL after](https://www.rfc-editor.org/info/rfc9293) [recovery from a reboot -- this is the "quiet time" specification. Hosts that prefer to avoid waiting](https://www.rfc-editor.org/rfc/rfc793#section-2) [and are willing to risk possible confusion of old and new packets at a given destination may](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [choose not to wait for the "quiet time". Implementers may provide TCP users with the ability to](https://www.rfc-editor.org/info/rfc2873) select on a connection-by-connection basis whether to wait after a reboot, or may informally [implement the "quiet time" for all connections. Obviously, even where a user selects to "wait",](https://www.rfc-editor.org/info/rfc8303) this is not necessary after the host has been "up" for at least MSL seconds.

[To summarize: every segment emitted occupies one or more sequence numbers in the sequence](https://www.rfc-editor.org/info/rfc5927) [space, and the numbers occupied by a segment are "busy" or "in use" until MSL seconds have](https://www.rfc-editor.org/info/rfc2883) [passed. Upon rebooting, a block of space-time is occupied by the octets and SYN or FIN flags of](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) any potentially still in-flight segments. If a new connection is started too soon and uses any of the [sequence numbers in the space-time footprint of those potentially still in-flight segments of the](https://www.rfc-editor.org/info/rfc2923) [previous connection incarnation, there is a potential sequence number overlap area that could](https://www.rfc-editor.org/info/rfc6429) [cause confusion at the receiver.](mailto:wes@mti-systems.com)

High-performance cases will have shorter cycle times than those in the megabits per second that [the base TCP design described above considers. At 1 Gbps, the cycle time is 34 seconds, only 3](https://www.rfc-editor.org/info/rfc1191) [seconds at 10 Gbps, and around a third of a second at 100 Gbps. In these higher-performance](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) cases, TCP Timestamp Options and Protection Against Wrapped Sequences (PAWS) [[47]](https://www.rfc-editor.org/info/rfc2119) [provide](https://www.rfc-editor.org/info/rfc2119) the needed capability to detect and discard old duplicates.

### 3.5. [Establishing a Connection](https://doi.org/10.1016/0376-5075(78)90053-3)

[The "three-way handshake" is the procedure used to establish a connection. This procedure](https://www.rfc-editor.org/info/rfc2474) [normally is initiated by one TCP peer and responded to by another TCP peer. The procedure also](https://www.rfc-editor.org/info/rfc896) [works if two TCP peers simultaneously initiate the procedure. When simultaneous open occurs,](https://www.rfc-editor.org/rfc/rfc6528#section-3) [each TCP peer receives a SYN segment that carries no acknowledgment after it has sent a SYN. Of](https://www.rfc-editor.org/info/rfc2914) [course, the arrival of an old duplicate SYN segment can potentially make it appear, to the](https://www.rfc-editor.org/info/rfc7094) recipient, that a simultaneous connection initiation is in progress. Proper use of "reset" segments can disambiguate these cases.

[Several examples of connection initiation follow. Although these examples do not show](https://www.rfc-editor.org/info/rfc7323) [connection synchronization using data-carrying segments, this is perfectly legitimate, so long as](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) the receiving TCP endpoint doesn't deliver the data to the user until it is clear the data is valid [(e.g., the data is buffered at the receiver until the connection reaches the ESTABLISHED state,](https://www.rfc-editor.org/info/rfc5044) given that the three-way handshake reduces the possibility of false connections). It is a trade-off between memory and messages to provide information for this checking.

The simplest 3WHS is shown in Figure 6. The figures should be interpreted in the following way. Each line is numbered for reference purposes. Right arrows (-->) indicate departure of a TCP [segment from TCP Peer A to TCP Peer B or arrival of a segment at B from A. Left arrows (<--)](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [indicate the reverse. Ellipses (...) indicate a segment that is still in the network (delayed).](https://www.rfc-editor.org/info/rfc7657) Comments appear in parentheses. TCP connection states represent the state AFTER the departure or arrival of the segment (whose contents are shown in the center of each line). Segment [contents are shown in abbreviated form, with sequence number, control flags, and ACK field.](https://www.rfc-editor.org/info/rfc5795) [Other fields such as window, addresses, lengths, and text have been left out in the interest of](https://www.rfc-editor.org/info/rfc8087) clarity.

### Peer [A](https://www.rfc-editor.org/rfc/rfc9293) TCP Peer B

## [1.](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [CLOSED](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) LISTEN

## 2. SYN-SENT [-->](https://www.rfc-editor.org/info/rfc8201) [<SEQ=100><CTL=SYN>](https://www.rfc-editor.org/info/rfc8201) [--> SYN-RECEIVED](https://www.rfc-editor.org/errata/eid2298)

## 3. [ESTABLISHED](mailto:wes@mti-systems.com) [<--](https://www.rfc-editor.org/info/rfc9170) [<SEQ=300><ACK=101><CTL=SYN,ACK>](https://www.rfc-editor.org/info/rfc791) <-- SYN-RECEIVED

## 4. ESTABLISHED --> <SEQ=101><ACK=301><CTL=ACK> [--> ESTABLISHED](https://www.rfc-editor.org/info/rfc8961)

## 5. ESTABLISHED [-->](https://www.rfc-editor.org/rfc/rfc7657#section-5.3) [<SEQ=101><ACK=301><CTL=ACK><DATA> --> ESTABLISHED](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

### Figure 6: Basic Three-Way Handshake for Connection Synchronization

[In line 2 of Figure 6, TCP Peer A begins by sending a SYN segment indicating that it will use](https://www.rfc-editor.org/info/rfc8548) [sequence numbers starting with sequence number 100. In line 3, TCP Peer B sends a SYN and](https://www.rfc-editor.org/info/rfc793) [acknowledges the SYN it received from TCP Peer A. Note that the acknowledgment field indicates](https://www.rfc-editor.org/info/rfc8558) [TCP Peer B is now expecting to hear sequence 101, acknowledging the SYN that occupied](https://www.rfc-editor.org/info/rfc2474) sequence 100.

[At line 4, TCP Peer A responds with an empty segment containing an ACK for TCP Peer B's SYN;](https://www.rfc-editor.org/info/rfc2914) and in line 5, TCP Peer A sends some data. Note that the sequence number of the segment in line [5 is the same as in line 4 because the ACK does not occupy sequence number space (if it did, we](https://www.rfc-editor.org/info/rfc7094) would wind up ACKing ACKs!).

[Simultaneous initiation is only slightly more complex, as is shown in Figure 7. Each TCP peer's](https://www.rfc-editor.org/info/rfc7323) [connection state cycles from CLOSED to SYN-SENT to SYN-RECEIVED to ESTABLISHED.](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html)

### Peer A [TCP Peer B](https://www.rfc-editor.org/info/rfc1644)

## 1. CLOSED [CLOSED](https://www.rfc-editor.org/info/rfc5461)

2. SYN-SENT --> <SEQ=100><CTL=SYN> [...](https://www.rfc-editor.org/errata/eid701)

## 3. SYN-RECEIVED [<--](https://www.rfc-editor.org/info/rfc5961) [<SEQ=300><CTL=SYN>](https://www.rfc-editor.org/info/rfc5961) [<-- SYN-SENT](https://www.rfc-editor.org/errata/eid1283)

## 4. [...](https://www.rfc-editor.org/info/rfc7657) [<SEQ=100><CTL=SYN>](https://www.rfc-editor.org/info/rfc7657) [--> SYN-RECEIVED](https://www.rfc-editor.org/errata/eid2296)

5. SYN-RECEIVED [-->](https://www.rfc-editor.org/info/rfc6298) <SEQ=100><ACK=301><CTL=SYN,ACK> ...

## 6. ESTABLISHED [<--](https://www.rfc-editor.org/info/rfc8087) <SEQ=300><ACK=101><CTL=SYN,ACK> <-- SYN-RECEIVED

## 7. [...](https://www.rfc-editor.org/errata/eid1562) [<SEQ=100><ACK=301><CTL=SYN,ACK> --> ESTABLISHED](https://www.rfc-editor.org/info/rfc9293)

### Figure 7: Simultaneous Connection Synchronization

A TCP implementation [MUST](https://www.rfc-editor.org/rfc/rfc5961#section-5) support simultaneous open attempts (MUST-10).

Note that a TCP implementation MUST keep track of whether a connection has reached SYN- [RECEIVED state as the result of a passive OPEN or an active OPEN (MUST-11).](https://www.rfc-editor.org/info/rfc8303)

[The principal reason for the three-way handshake is to prevent old duplicate connection](https://trustee.ietf.org/license-info) [initiations from causing confusion. To deal with this, a special control message, reset, is specified.](https://www.rfc-editor.org/info/rfc2883) [If the receiving TCP peer is in a non-synchronized state (i.e., SYN-SENT, SYN-RECEIVED), it returns](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) to LISTEN on receiving an acceptable reset. If the TCP peer is in one of the synchronized states [(ESTABLISHED, FIN-WAIT-1, FIN-WAIT-2, CLOSE-WAIT, CLOSING, LAST-ACK, TIME-WAIT), it](https://www.rfc-editor.org/info/rfc2923) [aborts the connection and informs its user. We discuss this latter case under "half-open"](https://www.rfc-editor.org/info/rfc6429) [connections below.](mailto:wes@mti-systems.com)

### Peer [A](https://www.rfc-editor.org/rfc/rfc7657#section-5.1) [TCP Peer B](https://www.rfc-editor.org/info/rfc1191)

## 1. CLOSED [LISTEN](https://www.rfc-editor.org/info/rfc6691)

2. SYN-SENT [-->](https://www.rfc-editor.org/info/rfc2119) <SEQ=100><CTL=SYN> [...](https://www.rfc-editor.org/info/rfc8548)

### 3. (duplicate) [...](https://doi.org/10.1016/0376-5075(78)90053-3) [<SEQ=90><CTL=SYN>](https://doi.org/10.1016/0376-5075(78)90053-3) [-->](https://www.iana.org/assignments/tcp-parameters/) [SYN-RECEIVED](https://www.iana.org/assignments/tcp-parameters/)

## [4.](https://www.iana.org/assignments/tcp-parameters/) [SYN-SENT](https://www.iana.org/assignments/tcp-parameters/) <-- <SEQ=300><ACK=91><CTL=SYN,ACK> [<--](https://www.rfc-editor.org/info/rfc2474) [SYN-RECEIVED](https://www.rfc-editor.org/info/rfc2474)

## 5. SYN-SENT --> <SEQ=91><CTL=RST> [-->](https://www.rfc-editor.org/info/rfc4821) [LISTEN](https://www.rfc-editor.org/info/rfc4821)

## 6. [...](https://doi.org/10.1109/INFCOM.1999.752180) <SEQ=100><CTL=SYN> [--> SYN-RECEIVED](https://www.rfc-editor.org/info/rfc2914)

## 7. ESTABLISHED [<--](https://www.rfc-editor.org/info/rfc7094) [<SEQ=400><ACK=101><CTL=SYN,ACK>](https://www.rfc-editor.org/info/rfc7094) [<-- SYN-RECEIVED](https://www.rfc-editor.org/info/rfc4987)

## 8. ESTABLISHED [-->](https://www.rfc-editor.org/info/rfc3168) [<SEQ=101><ACK=401><CTL=ACK>](https://www.rfc-editor.org/info/rfc3168) [--> ESTABLISHED](https://www.rfc-editor.org/info/rfc1122)

### [Figure 8: Recovery from Old Duplicate SYN](https://www.rfc-editor.org/info/rfc7323)

As a simple example of recovery from old duplicates, consider Figure 8. At line 3, an old [duplicate SYN arrives at TCP Peer B. TCP Peer B cannot tell that this is an old duplicate, so it](https://www.rfc-editor.org/info/rfc5044) responds normally (line 4). TCP Peer A detects that the ACK field is incorrect and returns a RST (reset) with its SEQ field selected to make the segment believable. TCP Peer B, on receiving the [RST, returns to the LISTEN state. When the original SYN finally arrives at line 6, the](https://www.rfc-editor.org/info/rfc5461) synchronization proceeds normally. If the SYN at line 6 had arrived before the RST, a more complex exchange might have occurred with RSTs sent in both directions.

#### 3.5.1. [Half-Open Connections and Other Anomalies](https://www.rfc-editor.org/info/rfc7657)

An established connection is said to be "half-open" if one of the TCP peers has closed or aborted the connection at its end without the knowledge of the other, or if the two ends of the connection [have become desynchronized owing to a failure or reboot that resulted in loss of memory. Such](https://www.rfc-editor.org/info/rfc5795) [connections will automatically become reset if an attempt is made to send data in either](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4) [direction. However, half-open connections are expected to be unusual.](https://www.rfc-editor.org/info/rfc9293)

[If at site A the connection no longer exists, then an attempt by the user at site B to send any data](https://www.rfc-editor.org/rfc/rfc793#section-2) [on it will result in the site B TCP endpoint receiving a reset control message. Such a message](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [indicates to the site B TCP endpoint that something is wrong, and it is expected to abort the](https://www.rfc-editor.org/info/rfc2873) connection.

[Assume that two user processes A and B are communicating with one another when a failure or](https://www.rfc-editor.org/info/rfc5927) [reboot occurs causing loss of memory to A's TCP implementation. Depending on the operating](https://www.rfc-editor.org/info/rfc2883) [system supporting A's TCP implementation, it is likely that some error recovery mechanism](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) exists. When the TCP endpoint is up again, A is likely to start again from the beginning or from a [recovery point. As a result, A will probably try to OPEN the connection again or try to SEND on](https://www.rfc-editor.org/info/rfc2923) [the connection it believes open. In the latter case, it receives the error message "connection not](https://www.rfc-editor.org/info/rfc6429) [open" from the local (A's) TCP implementation. In an attempt to establish the connection, A's TCP](https://www.rfc-editor.org/info/rfc791) implementation will send a segment containing SYN. This scenario leads to the example shown in Figure 9. After TCP Peer A reboots, the user attempts to reopen the connection. TCP Peer B, in [the meantime, thinks the connection is open.](https://www.rfc-editor.org/rfc/rfc7657#section-5.3)

### Peer [A](https://www.rfc-editor.org/info/rfc2119) [TCP Peer](https://www.rfc-editor.org/info/rfc8548) [B](https://www.rfc-editor.org/errata/eid2934)

### 1. (REBOOT) [(send 300,receive 100)](https://www.iana.org/assignments/tcp-parameters/)

## [2.](https://www.iana.org/assignments/tcp-parameters/) [CLOSED](https://www.iana.org/assignments/tcp-parameters/) [ESTABLISHED](https://www.rfc-editor.org/errata/eid3213)

## 3. SYN-SENT --> <SEQ=400><CTL=SYN> [-->](https://www.rfc-editor.org/info/rfc6994) [(??)](https://www.rfc-editor.org/info/rfc6994)

## 4. (!!) [<--](https://doi.org/10.1109/INFCOM.1999.752180) [<SEQ=300><ACK=100><CTL=ACK>](https://www.rfc-editor.org/info/rfc1011) [<--](https://www.rfc-editor.org/info/rfc2914) [ESTABLISHED](https://www.rfc-editor.org/info/rfc2914)

## 5. SYN-SENT [-->](https://www.rfc-editor.org/info/rfc7094) [<SEQ=100><CTL=RST>](https://www.rfc-editor.org/info/rfc7094) [-->](https://www.rfc-editor.org/info/rfc4987) [(Abort!!)](https://www.rfc-editor.org/info/rfc4987)

## 6. SYN-SENT [CLOSED](https://www.rfc-editor.org/info/rfc1122)

## 7. SYN-SENT [-->](https://www.rfc-editor.org/info/rfc7323) [<SEQ=400><CTL=SYN>](https://www.rfc-editor.org/info/rfc7323) [-->](https://www.rfc-editor.org/errata/eid6222)

### Figure 9: Half-Open Connection Discovery

[When the SYN arrives at line 3, TCP Peer B, being in a synchronized state, and the incoming](https://www.rfc-editor.org/info/rfc5044) segment outside the window, responds with an acknowledgment indicating what sequence it [next expects to hear (ACK 100). TCP Peer A sees that this segment does not acknowledge anything](https://www.rfc-editor.org/info/rfc5461) [it sent and, being unsynchronized, sends a reset (RST) because it has detected a half-open](https://www.iana.org/assignments/tcp-parameters/) connection. TCP Peer B aborts at line 5. TCP Peer A will continue to try to establish the [connection; the problem is now reduced to the basic three-way handshake of Figure 6.](https://www.rfc-editor.org/info/rfc5961)

[An interesting alternative case occurs when TCP Peer A reboots and TCP Peer B tries to send data](https://www.rfc-editor.org/info/rfc7657) on what it thinks is a synchronized connection. This is illustrated in Figure 10. In this case, the data arriving at TCP Peer A from TCP Peer B (line 2) is unacceptable because no such connection [exists, so TCP Peer A sends a RST. The RST is acceptable so TCP Peer B processes it and aborts the](https://www.rfc-editor.org/info/rfc5795) connection.

### Peer [A](https://www.rfc-editor.org/rfc/rfc9293) TCP Peer B

### [1.](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [(REBOOT)](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) (send 300,receive 100)

## 2. (??) [<--](https://www.rfc-editor.org/info/rfc8201) <SEQ=300><ACK=100><DATA=10><CTL=ACK> <-- ESTABLISHED

## 3. [-->](https://www.rfc-editor.org/info/rfc9170) [<SEQ=100><CTL=RST>](https://www.rfc-editor.org/info/rfc791) --> (ABORT!!)

### Figure 10: Active Side Causes Half-Open Connection Discovery

[In Figure 11, two TCP Peers A and B with passive connections waiting for SYN are depicted. An](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) old duplicate arriving at TCP Peer B (line 2) stirs B into action. A SYN-ACK is returned (line 3) and [causes TCP A to generate a RST (the ACK in line 3 is not acceptable). TCP Peer B accepts the reset](https://www.rfc-editor.org/info/rfc6691) [and returns to its passive LISTEN state.](https://www.rfc-editor.org/info/rfc2119)

### [Peer](https://www.iana.org/assignments/tcp-parameters/) [A](https://www.rfc-editor.org/errata/eid3213) [TCP Peer](https://www.rfc-editor.org/info/rfc2474) [B](https://www.rfc-editor.org/info/rfc2474)

## 1. LISTEN [LISTEN](https://www.rfc-editor.org/info/rfc4821)

## 2. ... [<SEQ=Z><CTL=SYN>](https://doi.org/10.1109/INFCOM.1999.752180) [-->](https://www.rfc-editor.org/info/rfc2914) [SYN-RECEIVED](https://www.rfc-editor.org/info/rfc2914)

## 3. (??) <-- [<SEQ=X><ACK=Z+1><CTL=SYN,ACK>](https://www.rfc-editor.org/info/rfc7094) [<--](https://www.rfc-editor.org/info/rfc4987) [SYN-RECEIVED](https://www.rfc-editor.org/info/rfc4987)

### 4. --> [<SEQ=Z+1><CTL=RST>](https://www.rfc-editor.org/info/rfc3168) --> (return to LISTEN!)

## 5. LISTEN LISTEN

### Figure 11: Old Duplicate SYN Initiates a Reset on Two Passive Sockets

A variety of other cases are possible, all of which are accounted for by the following rules for RST generation and processing.

#### 3.5.2. Reset Generation

A TCP user or application can issue a reset on a connection at any time, though reset events are [also generated by the protocol itself when various error conditions occur, as described below.](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [The side of a connection issuing a reset should enter the TIME-WAIT state, as this generally helps](https://www.rfc-editor.org/info/rfc7657) to reduce the load on busy servers for reasons described in [[70]](https://www.rfc-editor.org/errata/eid1561) [.](https://www.rfc-editor.org/errata/eid1561)

[As a general rule, reset (RST) is sent whenever a segment arrives that apparently is not intended](https://www.rfc-editor.org/info/rfc5795) [for the current connection. A reset must not be sent if it is not clear that this is the case.](https://www.rfc-editor.org/info/rfc8087)

There are three groups of states:

1. If the connection does not exist (CLOSED), then a reset is sent in response to any incoming [segment except another reset. A SYN segment that does not match an existing connection is](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) rejected by this means.

[If the incoming segment has the ACK bit set, the reset takes its sequence number from the](https://www.rfc-editor.org/info/rfc5927) [ACK field of the segment; otherwise, the reset has sequence number zero and the ACK field is](https://www.rfc-editor.org/info/rfc2883) [set to the sum of the sequence number and segment length of the incoming segment. The](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [connection remains in the CLOSED state.](https://www.rfc-editor.org/rfc/rfc1122)

2. [If the connection is in any non-synchronized state (LISTEN, SYN-SENT, SYN-RECEIVED), and](https://www.rfc-editor.org/info/rfc2923) [the incoming segment acknowledges something not yet sent (the segment carries an](https://www.rfc-editor.org/info/rfc6429) [unacceptable ACK), or if an incoming segment has a security level or compartment](https://www.rfc-editor.org/info/rfc791) (Appendix A.1) that does not exactly match the level and compartment requested for the [connection, a reset is sent.](https://www.rfc-editor.org/info/rfc8961)

[If the incoming segment has an ACK field, the reset takes its sequence number from the ACK](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) field of the segment; otherwise, the reset has sequence number zero and the ACK field is set to the sum of the sequence number and segment length of the incoming segment. The [connection remains in the same state.](https://www.rfc-editor.org/info/rfc2119)

3. [If the connection is in a synchronized state (ESTABLISHED, FIN-WAIT-1, FIN-WAIT-2, CLOSE-](https://www.rfc-editor.org/info/rfc793) [WAIT, CLOSING, LAST-ACK, TIME-WAIT), any unacceptable segment (out-of-window](https://www.rfc-editor.org/info/rfc8558) [sequence number or unacceptable acknowledgment number) must be responded to with an](https://www.rfc-editor.org/info/rfc2474) [empty acknowledgment segment (without any user data) containing the current send](https://www.rfc-editor.org/info/rfc6994) [sequence number and an acknowledgment indicating the next sequence number expected to](https://www.rfc-editor.org/rfc/rfc6528#section-3) be received, and the connection remains in the same state.

[If an incoming segment has a security level or compartment that does not exactly match the](https://www.rfc-editor.org/info/rfc7094) [level and compartment requested for the connection, a reset is sent and the connection goes](https://www.rfc-editor.org/ien/ien177.txt) [to the CLOSED state. The reset takes its sequence number from the ACK field of the incoming](https://www.rfc-editor.org/info/rfc3168) segment.

#### 3.5.3. Reset Processing

[In all states except SYN-SENT, all reset (RST) segments are validated by checking their SEQ fields.](https://www.rfc-editor.org/info/rfc5044) A reset is valid if its sequence number is in the window. In the SYN-SENT state (a RST received in [response to an initial SYN), the RST is acceptable if the ACK field acknowledges the SYN.](https://www.rfc-editor.org/info/rfc5461)

The receiver of a RST first validates it, then changes state. If the receiver was in the LISTEN state, it ignores it. If the receiver was in SYN-RECEIVED state and had previously been in the LISTEN [state, then the receiver returns to the LISTEN state; otherwise, the receiver aborts the connection](https://www.rfc-editor.org/info/rfc5961) [and goes to the CLOSED state. If the receiver was in any other state, it aborts the connection and](https://www.rfc-editor.org/info/rfc7657) [advises the user and goes to the CLOSED state.](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00)

TCP implementations [SHOULD](https://www.rfc-editor.org/info/rfc6298) [allow a received RST segment to include data (SHLD-2). It has been](https://www.rfc-editor.org/info/rfc2525) [suggested that a RST segment could contain diagnostic data that explains the cause of the RST. No](https://www.rfc-editor.org/info/rfc8087) [standard has yet been established for such data.](https://www.rfc-editor.org/errata/eid1562)

### 3.6. [Closing a Connection](https://www.rfc-editor.org/errata/eid3602)

[CLOSE is an operation meaning "I have no more data to send." The notion of closing a full-duplex](https://www.rfc-editor.org/info/rfc2873) connection is subject to ambiguous interpretation, of course, since it may not be obvious how to treat the receiving side of the connection. We have chosen to treat CLOSE in a simplex fashion. [The user who CLOSEs may continue to RECEIVE until the TCP receiver is told that the remote](https://www.rfc-editor.org/info/rfc8303)

[peer has CLOSED also. Thus, a program could initiate several SENDs followed by a CLOSE, and](https://www.rfc-editor.org/info/rfc5927) [then continue to RECEIVE until signaled that a RECEIVE failed because the remote peer has](https://www.rfc-editor.org/info/rfc2883) [CLOSED. The TCP implementation will signal a user, even if no RECEIVEs are outstanding, that](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) the remote peer has closed, so the user can terminate their side gracefully. A TCP implementation [will reliably deliver all buffers SENT before the connection was CLOSED so a user who expects no](https://www.rfc-editor.org/info/rfc2923) [data in return need only wait to hear the connection was CLOSED successfully to know that all](https://www.rfc-editor.org/info/rfc6429) [their data was received at the destination TCP endpoint. Users must keep reading connections](https://www.rfc-editor.org/info/rfc791) they close for sending until the TCP implementation indicates there is no more data.

There are essentially three cases:

1) [The user initiates by telling the TCP implementation to CLOSE the connection (TCP Peer A](https://www.rfc-editor.org/info/rfc6691) in Figure 12).

2) [The remote TCP endpoint initiates by sending a FIN control signal (TCP Peer B in Figure](https://www.rfc-editor.org/info/rfc793) 12).

[3)](https://www.iana.org/assignments/tcp-parameters/) Both users CLOSE simultaneously (Figure 13).

Case 1: [Local user initiates the close](https://www.rfc-editor.org/errata/eid3300)

[In this case, a FIN segment can be constructed and placed on the outgoing segment queue. No](https://www.rfc-editor.org/info/rfc7094) further SENDs from the user will be accepted by the TCP implementation, and it enters the [FIN-WAIT-1 state. RECEIVEs are allowed in this state. All segments preceding and including](https://www.rfc-editor.org/info/rfc3168) [FIN will be retransmitted until acknowledged. When the other TCP peer has both](https://www.rfc-editor.org/info/rfc4953) [acknowledged the FIN and sent a FIN of its own, the first TCP peer can ACK this FIN. Note that](https://www.rfc-editor.org/info/rfc7323) [a TCP endpoint receiving a FIN will ACK but not send its own FIN until its user has CLOSED](https://www.rfc-editor.org/info/rfc1349) the connection also.

Case 2: TCP endpoint receives a FIN from the network

If an unsolicited FIN arrives from the network, the receiving TCP endpoint can ACK it and tell the user that the connection is closing. The user will respond with a CLOSE, upon which the TCP endpoint can send a FIN to the other TCP peer after sending any remaining data. The TCP [endpoint then waits until its own FIN is acknowledged whereupon it deletes the connection. If](https://www.rfc-editor.org/info/rfc2018) [an ACK is not forthcoming, after the user timeout the connection is aborted and the user is](https://www.rfc-editor.org/info/rfc7657) told.

Case 3: [Both users close simultaneously](https://www.rfc-editor.org/info/rfc5795)

[A simultaneous CLOSE by users at both ends of a connection causes FIN segments to be](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [exchanged (Figure 13). When all segments preceding the FINs have been processed and](https://www.rfc-editor.org/info/rfc9293) acknowledged, each TCP peer can ACK the FIN it has received. Both will, upon receiving these [ACKs, delete the connection.](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

### Peer [A](https://www.rfc-editor.org/rfc/rfc9293) TCP Peer B

## [1.](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [ESTABLISHED](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) ESTABLISHED

### 2. (Close) FIN-WAIT-1 [-->](https://www.rfc-editor.org/info/rfc8201) [<SEQ=100><ACK=300><CTL=FIN,ACK>](https://www.rfc-editor.org/info/rfc6429) --> CLOSE-WAIT

## 3. FIN-WAIT-2 <-- <SEQ=300><ACK=101><CTL=ACK> [<-- CLOSE-WAIT](https://www.rfc-editor.org/errata/eid2748)

### 4. [(Close)](https://www.rfc-editor.org/info/rfc1191) TIME-WAIT [<--](https://www.rfc-editor.org/rfc/rfc7657#section-5.3) [<SEQ=300><ACK=101><CTL=FIN,ACK>](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) <-- LAST-ACK

## 5. TIME-WAIT [-->](https://www.rfc-editor.org/info/rfc3465) <SEQ=101><ACK=301><CTL=ACK> [--> CLOSED](https://www.rfc-editor.org/info/rfc2119)

## 6. [(2](https://www.rfc-editor.org/rfc/rfc5570#section-7.3.1) MSL) [CLOSED](https://www.rfc-editor.org/rfc/rfc5570#section-7.3.1)

### Figure 12: Normal Close Sequence

### Peer A [TCP Peer B](https://www.rfc-editor.org/info/rfc8684)

## 1. ESTABLISHED [ESTABLISHED](https://www.rfc-editor.org/info/rfc4987)

2. (Close) [(Close)](https://www.rfc-editor.org/info/rfc1122) FIN-WAIT-1 [-->](https://www.rfc-editor.org/info/rfc3168) [<SEQ=100><ACK=300><CTL=FIN,ACK>](https://www.rfc-editor.org/info/rfc3168) ... FIN-WAIT-1 [<--](https://www.rfc-editor.org/info/rfc1122) [<SEQ=300><ACK=100><CTL=FIN,ACK>](https://www.rfc-editor.org/info/rfc4953) [<--](https://www.rfc-editor.org/info/rfc4953) [...](https://www.rfc-editor.org/info/rfc7323) [<SEQ=100><ACK=300><CTL=FIN,ACK>](https://www.rfc-editor.org/info/rfc7323) -->

| <-- | <SEQ=301><ACK=101><CTL=ACK> | <-- |
| --- | --------------------------- | --- |
| ... | <SEQ=101><ACK=301><CTL=ACK> | --> |

## 4. TIME-WAIT [TIME-WAIT](https://www.rfc-editor.org/info/rfc5681) (2 MSL) [(2](https://www.rfc-editor.org/info/rfc5461) [MSL)](https://www.rfc-editor.org/errata/eid700) CLOSED [CLOSED](https://www.rfc-editor.org/info/rfc7414)

### Figure 13: Simultaneous Close Sequence

[A TCP connection may terminate in two ways: (1) the normal TCP close sequence using a FIN](https://www.rfc-editor.org/info/rfc7657) handshake (Figure 12), and (2) an "abort" in which one or more RST segments are sent and the connection state is immediately discarded. If the local TCP connection is closed by the remote [side due to a FIN or RST received from the remote side, then the local application](https://www.rfc-editor.org/info/rfc5795) [MUST](https://www.rfc-editor.org/info/rfc2525) [be](https://www.rfc-editor.org/info/rfc8087) [informed whether it closed normally or was aborted (MUST-12).](https://www.rfc-editor.org/info/rfc8087)

#### [3.6.1.](https://www.rfc-editor.org/rfc/rfc8095#section-3.1) Half-Closed Connections

[The normal TCP close sequence delivers buffered data reliably in both directions. Since the two](https://www.rfc-editor.org/rfc/rfc793#section-2) [directions of a TCP connection are closed independently, it is possible for a connection to be "half](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [closed", i.e., closed in only one direction, and a host is permitted to continue sending data in the](https://www.rfc-editor.org/info/rfc2873) [open direction on a half-closed connection.](https://www.rfc-editor.org/errata/eid1571)

A host MAY [implement a "half-duplex" TCP close sequence, so that an application that has called](https://www.rfc-editor.org/info/rfc5927) [CLOSE cannot continue to read data from the connection (MAY-1). If such a host issues a CLOSE](https://www.rfc-editor.org/info/rfc2883) [call while received data is still pending in the TCP connection, or if new data is received after](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [CLOSE is called, its TCP implementation](https://www.rfc-editor.org/rfc/rfc1011) SHOULD send a RST to show that data was lost (SHLD-3). See [23], Section 2.17 for discussion.

[When a connection is closed actively, it](https://www.rfc-editor.org/info/rfc9170) [MUST](https://www.rfc-editor.org/info/rfc791) linger in the TIME-WAIT state for a time 2xMSL (Maximum Segment Lifetime) (MUST-13). However, it MAY [accept a new SYN from the remote](https://www.rfc-editor.org/errata/eid2748) TCP endpoint to reopen the connection directly from TIME-WAIT state (MAY-2), if it:

(1) assigns its initial sequence number for the new connection to be larger than the largest sequence number it used on the previous connection incarnation, and

(2) [returns to TIME-WAIT state if the SYN turns out to be an old duplicate.](https://www.rfc-editor.org/info/rfc8548)

[When the TCP Timestamp Options are available, an improved algorithm is described in](https://www.rfc-editor.org/info/rfc6864) [[40]](https://www.iana.org/assignments/tcp-parameters/) [in](https://www.iana.org/assignments/tcp-parameters/) [order to support higher connection establishment rates. This algorithm for reducing TIME-WAIT](https://www.rfc-editor.org/info/rfc8558) is a Best Current Practice that SHOULD [be implemented since Timestamp Options are commonly](https://www.rfc-editor.org/info/rfc2474) [used, and using them to reduce TIME-WAIT provides benefits for busy Internet servers (SHLD-4).](https://www.rfc-editor.org/rfc/rfc6528#section-3)

### 3.7. Segmentation

The term "segmentation" refers to the activity TCP performs when ingesting a stream of bytes [from a sending application and packetizing that stream of bytes into TCP segments. Individual](https://www.rfc-editor.org/info/rfc3168) [TCP segments often do not correspond one-for-one to individual send (or socket write) calls from](https://www.rfc-editor.org/info/rfc4953) [the application. Applications may perform writes at the granularity of messages in the upper-](https://www.rfc-editor.org/info/rfc7323) [layer protocol, but TCP guarantees no correlation between the boundaries of TCP segments sent](https://www.rfc-editor.org/info/rfc1349) [and received and the boundaries of the read or write buffers of user application data. In some](https://www.rfc-editor.org/info/rfc5044) specific protocols, such as Remote Direct Memory Access (RDMA) using Direct Data Placement [(DDP) and Marker PDU Aligned Framing (MPA)](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.4.2) [34] [, there are performance optimizations](https://www.rfc-editor.org/info/rfc5681) [possible when the relation between TCP segments and application data units can be controlled,](https://www.rfc-editor.org/info/rfc5461) and MPA includes a specific mechanism for detecting and verifying this relationship between TCP segments and application message data structures, but this is specific to applications like [RDMA. In general, multiple goals influence the sizing of TCP segments created by a TCP](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) implementation.

Goals driving the sending of larger segments include:

- [Reducing the number of packets in flight within the network.](https://www.rfc-editor.org/info/rfc5795)

- [Increasing processing efficiency and potential performance by enabling a smaller number of](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [interrupts and inter-layer interactions.](https://www.rfc-editor.org/errata/eid1562)

- [Limiting the overhead of TCP headers.](https://www.rfc-editor.org/errata/eid3602)

[Note that the performance benefits of sending larger segments may decrease as the size](https://www.rfc-editor.org/info/rfc2873) increases, and there may be boundaries where advantages are reversed. For instance, on some implementation architectures, 1025 bytes within a segment could lead to worse performance than 1024 bytes, due purely to data alignment on copy operations.

[Goals driving the sending of smaller segments include:](https://trustee.ietf.org/license-info)

- [Avoiding sending a TCP segment that would result in an IP datagram larger than the smallest](https://www.rfc-editor.org/info/rfc2883) [MTU along an IP network path because this results in either packet loss or packet](https://www.rfc-editor.org/rfc/rfc6528) [fragmentation. Making matters worse, some firewalls or middleboxes may drop fragmented](https://www.rfc-editor.org/info/rfc2923) [packets or ICMP messages related to fragmentation.](https://www.rfc-editor.org/info/rfc8201)

- [Preventing delays to the application data stream, especially when TCP is waiting on the](https://www.rfc-editor.org/info/rfc791) application to generate more data, or when the application is waiting on an event or input from its peer in order to generate more data.

- [Enabling "fate sharing" between TCP segments and lower-layer data units (e.g., below IP, for](https://www.rfc-editor.org/info/rfc1191) links with cell or frame sizes smaller than the IP MTU).

[Towards meeting these competing sets of goals, TCP includes several mechanisms, including the](https://www.rfc-editor.org/info/rfc8548) Maximum Segment Size Option, Path MTU Discovery, the Nagle algorithm, and support for IPv6 [Jumbograms, as discussed in the following subsections.](https://doi.org/10.1016/0376-5075(78)90053-3)

#### 3.7.1. [Maximum Segment Size Option](https://www.rfc-editor.org/errata/eid3213)

TCP endpoints MUST implement both sending and receiving the MSS Option (MUST-14).

TCP implementations [SHOULD](https://doi.org/10.1109/INFCOM.1999.752180) [send an MSS Option in every SYN segment when its receive MSS](https://www.rfc-editor.org/info/rfc2914) [differs from the default 536 for IPv4 or 1220 for IPv6 (SHLD-5), and](https://www.rfc-editor.org/info/rfc7094) [MAY](https://www.rfc-editor.org/info/rfc4987) [send it always (MAY-3).](https://www.rfc-editor.org/info/rfc4987)

[If an MSS Option is not received at connection setup, TCP implementations](https://www.rfc-editor.org/info/rfc9000) [MUST](https://www.rfc-editor.org/info/rfc1122) [assume a](https://www.rfc-editor.org/info/rfc1122) [default send MSS of 536 (576 - 40) for IPv4 or 1220 (1280 - 60) for IPv6 (MUST-15).](https://www.rfc-editor.org/info/rfc3168)

[The maximum size of a segment that a TCP endpoint really sends, the "effective send MSS",](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [MUST](https://www.rfc-editor.org/info/rfc5033)

[be the smaller (MUST-16) of the send MSS (that reflects the available reassembly buffer size at the](https://www.rfc-editor.org/info/rfc1349) remote host, the EMTU_R [[19]](https://www.rfc-editor.org/info/rfc5044) [) and the largest transmission size permitted by the IP layer](https://www.rfc-editor.org/info/rfc7413) (EMTU_S [19] ):

[Eff.snd.MSS = min(SendMSS+20, MMS_S) - TCPhdrsize - IPoptionsize](https://www.rfc-editor.org/info/rfc5461)

where:

- [SendMSS is the MSS value received from the remote host, or the default 536 for IPv4 or 1220](https://www.rfc-editor.org/info/rfc2018) [for IPv6, if no MSS Option is received.](https://www.rfc-editor.org/info/rfc7657)

- MMS_S is the maximum size for a transport-layer message that TCP may send.

- TCPhdrsize is the size of the fixed TCP header and any options. This is 20 in the (rare) case [that no options are present but may be larger if TCP Options are to be sent. Note that some](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [options might not be included on all segments, but that for each segment sent, the sender](https://www.rfc-editor.org/info/rfc6633) [should adjust the data length accordingly, within the Eff.snd.MSS.](https://www.rfc-editor.org/info/rfc9293)

- IPoptionsize is the size of any IPv4 options or IPv6 extension headers associated with a TCP [connection. Note that some options or extension headers might not be included on all](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) packets, but that for each segment sent, the sender should adjust the data length accordingly, within the Eff.snd.MSS.

[The MSS value to be sent in an MSS Option should be equal to the effective MTU minus the fixed](https://www.rfc-editor.org/info/rfc5927) [IP and TCP headers. By ignoring both IP and TCP Options when calculating the value for the MSS](https://www.rfc-editor.org/info/rfc2883) [Option, if there are any IP or TCP Options to be sent in a packet, then the sender must decrease](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [the size of the TCP data accordingly. RFC 6691](https://www.rfc-editor.org/errata/eid2297) [43] discusses this in greater detail.

[The MSS value to be sent in an MSS Option must be less than or equal to:](https://www.rfc-editor.org/info/rfc8201)

## [MMS_R - 20](mailto:wes@mti-systems.com)

[where MMS_R is the maximum size for a transport-layer message that can be received (and](https://www.rfc-editor.org/info/rfc1191) [reassembled at the IP layer) (MUST-67). TCP obtains MMS_R and MMS_S from the IP layer; see the](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) generic call GET_MAXSIZES in Section 3.4 of RFC 1122. These are defined in terms of their IP MTU [equivalents, EMTU_R and EMTU_S](https://www.rfc-editor.org/info/rfc3465) [19] .

When TCP is used in a situation where either the IP or TCP headers are not fixed, the sender must [reduce the amount of TCP data in any given packet by the number of octets used by the IP and](https://www.rfc-editor.org/info/rfc793) [TCP options. This has been a point of confusion historically, as explained in RFC 6691, Section 3.1.](https://www.rfc-editor.org/info/rfc8558)

#### 3.7.2. Path MTU Discovery

[A TCP implementation may be aware of the MTU on directly connected links, but will rarely have](https://www.rfc-editor.org/info/rfc2914) [insight about MTUs across an entire network path. For IPv4, RFC 1122 recommends an IP-layer](https://www.rfc-editor.org/info/rfc1011) [default effective MTU of less than or equal to 576 for destinations not directly connected, and for](https://www.rfc-editor.org/info/rfc7094) [IPv6 this would be 1280. Using these fixed values limits TCP connection performance and](https://www.rfc-editor.org/ien/ien177.txt) [efficiency. Instead, implementation of Path MTU Discovery (PMTUD) and Packetization Layer](https://www.rfc-editor.org/info/rfc3168) [Path MTU Discovery (PLPMTUD) is strongly recommended in order for TCP to improve](https://www.rfc-editor.org/info/rfc7323) [segmentation decisions. Both PMTUD and PLPMTUD help TCP choose segment sizes that avoid](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) both on-path (for IPv4) and source fragmentation (IPv4 and IPv6).

PMTUD for IPv4 [[2]](https://www.rfc-editor.org/info/rfc9065) [or IPv6](https://www.rfc-editor.org/info/rfc9065) [[14]](https://www.rfc-editor.org/info/rfc9065) [is implemented in conjunction between TCP, IP, and ICMP. It](https://www.rfc-editor.org/rfc/rfc5961#section-1.1) relies both on avoiding source fragmentation and setting the IPv4 DF (don't fragment) flag, the [latter to inhibit on-path fragmentation. It relies on ICMP errors from routers along the path](https://www.rfc-editor.org/info/rfc5461) whenever a segment is too large to traverse a link. Several adjustments to a TCP implementation with PMTUD are described in RFC 2923 in order to deal with problems experienced in practice [27] . PLPMTUD [[31]](https://www.rfc-editor.org/info/rfc5961) [is a Standards Track improvement to PMTUD that relaxes the requirement](https://www.rfc-editor.org/errata/eid1283) [for ICMP support across a path, and improves performance in cases where ICMP is not](https://www.rfc-editor.org/info/rfc7657) consistently conveyed, but still tries to avoid source fragmentation. The mechanisms in all four of these RFCs are recommended to be included in TCP implementations.

[The TCP MSS Option specifies an upper bound for the size of packets that can be received (see](https://www.rfc-editor.org/info/rfc8087) [43] [). Hence, setting the value in the MSS Option too small can impact the ability for PMTUD or](https://www.rfc-editor.org/info/rfc6633) [PLPMTUD to find a larger path MTU. RFC 1191 discusses this implication of many older TCP](https://www.rfc-editor.org/info/rfc9293) implementations setting the TCP MSS to 536 (corresponding to the IPv4 576 byte default MTU) for [non-local destinations, rather than deriving it from the MTUs of connected interfaces as](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) recommended.

#### 3.7.3. [Interfaces with Variable MTU Values](https://www.rfc-editor.org/info/rfc8311)

[The effective MTU can sometimes vary, as when used with variable compression, e.g., RObust](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [Header Compression (ROHC)](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) [[37]](https://www.rfc-editor.org/rfc/rfc5961) . It is tempting for a TCP implementation to advertise the largest [possible MSS, to support the most efficient use of compressed payloads. Unfortunately, some](https://www.rfc-editor.org/info/rfc2923) [compression schemes occasionally need to transmit full headers (and thus smaller payloads) to](https://www.rfc-editor.org/info/rfc6429) [resynchronize state at their endpoint compressors/decompressors. If the largest MTU is used to](https://www.rfc-editor.org/info/rfc791) calculate the value to advertise in the MSS Option, TCP retransmission may interfere with compressor resynchronization.

As a result, when the effective MTU of an interface varies packet-to-packet, TCP implementations SHOULD [use the smallest effective MTU of the interface to calculate the value to advertise in the](https://www.rfc-editor.org/info/rfc6691) MSS Option (SHLD-6).

#### 3.7.4. Nagle Algorithm

The "Nagle algorithm" was described in RFC 896 [[17]](https://www.rfc-editor.org/info/rfc2474) [and was recommended in RFC 1122](https://www.rfc-editor.org/info/rfc2474) [19] for [mitigation of an early problem of too many small packets being generated. It has been](https://www.rfc-editor.org/info/rfc896) [implemented in most current TCP code bases, sometimes with minor variations (see Appendix A.](https://www.rfc-editor.org/rfc/rfc6528#section-3) 3).

[If there is unacknowledged data (i.e., SND.NXT > SND.UNA), then the sending TCP endpoint](https://www.rfc-editor.org/info/rfc7094) [buffers all user data (regardless of the PSH bit) until the outstanding data has been](https://www.rfc-editor.org/ien/ien177.txt) [acknowledged or until the TCP endpoint can send a full-sized segment (Eff.snd.MSS bytes).](https://www.rfc-editor.org/info/rfc3168)

A TCP implementation [SHOULD](https://www.rfc-editor.org/info/rfc7323) [implement the Nagle algorithm to coalesce short segments](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) (SHLD-7). However, there MUST [be a way for an application to disable the Nagle algorithm on an](https://www.rfc-editor.org/info/rfc1349) [individual connection (MUST-17). In all cases, sending data is also subject to the limitation](https://www.rfc-editor.org/info/rfc5044) [imposed by the slow start algorithm](https://www.rfc-editor.org/info/rfc9065) [[8]](https://www.rfc-editor.org/info/rfc9065) .

[Since there can be problematic interactions between the Nagle algorithm and delayed](https://www.rfc-editor.org/info/rfc5461) acknowledgments, some implementations use minor variations of the Nagle algorithm, such as the one described in Appendix A.3.

#### 3.7.5. IPv6 Jumbograms

[In order to support TCP over IPv6 Jumbograms, implementations need to be able to send TCP](https://www.rfc-editor.org/info/rfc7657) segments larger than the 64-KB limit that the MSS Option can convey. RFC 2675 [[24]](https://www.rfc-editor.org/info/rfc6298) [defines that](https://www.rfc-editor.org/info/rfc6298) [an MSS value of 65,535 bytes is to be treated as infinity, and Path MTU Discovery](https://www.rfc-editor.org/info/rfc5795) [[14]](https://www.rfc-editor.org/info/rfc2525) [is used to](https://www.rfc-editor.org/info/rfc8087) determine the actual MSS.

| support attachment to links with an MTU greater than 65,575 | [24] | , and the present IPv6 Node |
| ----------------------------------------------------------- | ---- | --------------------------- |
| Requirements does not include support for Jumbograms        | [55] | .                           |

### 3.8. [Data Communication](https://www.rfc-editor.org/rfc/rfc9293)

[Once the connection is established, data is communicated by the exchange of segments. Because](https://www.rfc-editor.org/rfc/rfc6691) [segments may be lost due to errors (checksum test failure) or network congestion, TCP uses](https://www.rfc-editor.org/info/rfc2923) [retransmission to ensure delivery of every segment. Duplicate segments may arrive due to](https://www.rfc-editor.org/info/rfc6429) [network or TCP retransmission. As discussed in the section on sequence numbers (Section 3.4),](https://www.rfc-editor.org/info/rfc791) the TCP implementation performs certain tests on the sequence and acknowledgment numbers [in the segments to verify their acceptability.](https://www.rfc-editor.org/errata/eid2748)

[The sender of data keeps track of the next sequence number to use in the variable SND.NXT. The](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [receiver of data keeps track of the next sequence number to expect in the variable RCV.NXT. The](https://www.rfc-editor.org/info/rfc6691) [sender of data keeps track of the oldest unacknowledged sequence number in the variable](https://www.rfc-editor.org/info/rfc8548) SND.UNA. If the data flow is momentarily idle and all data sent has been acknowledged, then the three variables will be equal.

[When the sender creates a segment and transmits it, the sender advances SND.NXT. When the](https://www.rfc-editor.org/info/rfc2474) [receiver accepts a segment, it advances RCV.NXT and sends an acknowledgment. When the data](https://www.rfc-editor.org/info/rfc896) sender receives an acknowledgment, it advances SND.UNA. The extent to which the values of [these variables differ is a measure of the delay in the communication. The amount by which the](https://www.rfc-editor.org/info/rfc2914) [variables are advanced is the length of the data and SYN or FIN flags in the segment. Note that,](https://www.rfc-editor.org/info/rfc7094) once in the ESTABLISHED state, all segments must carry current acknowledgment information.

[The CLOSE user call implies a push function (see Section 3.9.1), as does the FIN control flag in an](https://www.rfc-editor.org/info/rfc3168) incoming segment.

#### 3.8.1. Retransmission Timeout

[Because of the variability of the networks that compose an internetwork system and the wide](https://www.rfc-editor.org/info/rfc5044) range of uses of TCP connections, the retransmission timeout (RTO) must be dynamically determined.

The RTO MUST be computed according to the algorithm in [[10]](https://www.rfc-editor.org/info/rfc7414) [, including Karn's algorithm for](https://www.rfc-editor.org/info/rfc7414) taking RTT samples (MUST-18).

[RFC 793 contains an early example procedure for computing the RTO, based on work mentioned](https://www.rfc-editor.org/info/rfc7657) in IEN 177 [71] . This was then replaced by the algorithm described in RFC 1122, which was subsequently updated in RFC 2988 and then again in RFC 6298.

[RFC 1122 allows that if a retransmitted packet is identical to the original packet (which implies](https://www.rfc-editor.org/info/rfc8087) [not only that the data boundaries have not changed, but also that none of the headers have](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4) [changed), then the same IPv4 Identification field](https://www.rfc-editor.org/errata/eid1562) [MAY](https://www.rfc-editor.org/info/rfc9293) [be used (see Section 3.2.1.5 of RFC 1122)](https://www.rfc-editor.org/info/rfc2675) (MAY-4). The same IP Identification field may be reused anyways since it is only meaningful when a datagram is fragmented [[44]](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [. TCP implementations should not rely on or typically](https://www.rfc-editor.org/info/rfc8095) [interact with this IPv4 header field in any way. It is not a reasonable way to indicate duplicate](https://www.rfc-editor.org/info/rfc2873) [sent segments nor to identify duplicate received segments.](https://www.rfc-editor.org/info/rfc6093)

#### 3.8.2. [TCP Congestion Control](https://www.rfc-editor.org/info/rfc8200)

- [explains the importance of congestion control for the Internet.](https://www.rfc-editor.org/rfc/rfc6528)

[RFC 1122 required implementation of Van Jacobson's congestion control algorithms slow start](https://www.rfc-editor.org/info/rfc2923) [and congestion avoidance together with exponential backoff for successive RTO values for the](https://www.rfc-editor.org/info/rfc6429) [same segment. RFC 2581 provided IETF Standards Track description of slow start and congestion](https://www.rfc-editor.org/info/rfc791) avoidance, along with fast retransmit and fast recovery. RFC 5681 is the current description of [these algorithms and is the current Standards Track specification providing guidelines for TCP](https://www.rfc-editor.org/info/rfc1191) [congestion control. RFC 6298 describes exponential backoff of RTO values, including keeping the](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) backed-off value until a subsequent segment with new data has been sent and acknowledged without retransmission.

A TCP endpoint [MUST](https://www.rfc-editor.org/errata/eid2934) implement the basic congestion control algorithms slow start, congestion [avoidance, and exponential backoff of RTO to avoid creating congestion collapse conditions](https://www.rfc-editor.org/info/rfc793) [(MUST-19). RFC 5681 and RFC 6298 describe the basic algorithms on the IETF Standards Track](https://www.rfc-editor.org/info/rfc8558) [that are broadly applicable. Multiple other suitable algorithms exist and have been widely used.](https://www.rfc-editor.org/info/rfc2474) Many TCP implementations support a set of alternative algorithms that can be configured for use on the endpoint. An endpoint MAY [implement such alternative algorithms provided that the](https://www.rfc-editor.org/info/rfc8684) [algorithms are conformant with the TCP specifications from the IETF Standards Track as](https://www.rfc-editor.org/info/rfc1011) described in RFC 2914, RFC 5033 [[7]](https://www.rfc-editor.org/info/rfc7094) [, and RFC 8961](https://www.rfc-editor.org/info/rfc7094) [[15]](https://www.rfc-editor.org/info/rfc4987) [(MAY-18).](https://www.rfc-editor.org/info/rfc4987)

[Explicit Congestion Notification (ECN) was defined in RFC 3168 and is an IETF Standards Track](https://www.rfc-editor.org/info/rfc3168) [enhancement that has many benefits](https://www.rfc-editor.org/info/rfc1122) [[51]](https://www.rfc-editor.org/info/rfc4953) [.](https://www.rfc-editor.org/info/rfc4953)

A TCP endpoint [SHOULD](https://www.rfc-editor.org/rfc/rfc5461#section-4) [implement ECN as described in RFC 3168 (SHLD-8).](https://www.rfc-editor.org/info/rfc1349)

#### 3.8.3. [TCP Connection Failures](https://www.rfc-editor.org/info/rfc5044)

Excessive retransmission of the same segment by a TCP endpoint indicates some failure of the [remote host or the internetwork path. This failure may be of short or long duration. The](https://www.rfc-editor.org/info/rfc5461) following procedure [MUST](https://www.iana.org/assignments/tcp-parameters/) [be used to handle excessive retransmissions of data segments](https://www.rfc-editor.org/info/rfc7414) (MUST-20):

(a) [There are two thresholds R1 and R2 measuring the amount of retransmission that has](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) occurred for the same segment. R1 and R2 might be measured in time units or as a count of retransmissions (with the current RTO and corresponding backoffs as a conversion factor, if needed).

(b) [When the number of transmissions of the same segment reaches or exceeds threshold R1,](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [pass negative advice (see](https://www.rfc-editor.org/errata/eid1562) [Section 3.3.1.4 of [19]](https://www.rfc-editor.org/info/rfc9293) [) to the IP layer, to trigger dead-gateway](https://www.rfc-editor.org/info/rfc6633) [diagnosis.](https://www.rfc-editor.org/rfc/rfc8095#section-3.1)

(c) [When the number of transmissions of the same segment reaches a threshold R2 greater](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [than R1, close the connection.](https://www.rfc-editor.org/info/rfc8174)

(d) An application [MUST](https://www.rfc-editor.org/errata/eid4772) [(MUST-21) be able to set the value for R2 for a particular connection.](https://www.rfc-editor.org/errata/eid1571) [For example, an interactive application might set R2 to "infinity", giving the user control](https://www.rfc-editor.org/info/rfc8303) over when to disconnect.

(e) [TCP implementations](https://trustee.ietf.org/license-info) [SHOULD](https://trustee.ietf.org/license-info) [inform the application of the delivery problem (unless such](https://www.rfc-editor.org/info/rfc8200) [information has been disabled by the application; see the "Asynchronous Reports" section](https://www.rfc-editor.org/info/rfc2883) [(Section 3.9.1.8)), when R1 is reached and before R2 (SHLD-9). This will allow a remote](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) login application program to inform the user, for example.

| The value of R1 | SHOULD | correspond to at least 3 retransmissions, at the current RTO (SHLD-10). |
| --------------- | ------ | ----------------------------------------------------------------------- |
| The value of R2 | SHOULD | correspond to at least 100 seconds (SHLD-11).                           |

An attempt to open a TCP connection could fail with excessive retransmissions of the SYN [segment or by receipt of a RST segment or an ICMP Port Unreachable. SYN retransmissions](https://www.rfc-editor.org/info/rfc1191) MUST

[be handled in the general way just described for data retransmissions, including notification of](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) the application layer.

[However, the values of R1 and R2 may be different for SYN and data segments. In particular, R2](https://www.rfc-editor.org/info/rfc8548) [for a SYN segment](https://www.rfc-editor.org/rfc/rfc5570#section-7.3.1) [MUST](https://www.rfc-editor.org/errata/eid2934) [be set large enough to provide retransmission of the segment for at least](https://www.rfc-editor.org/info/rfc793) [3 minutes (MUST-23). The application can close the connection (i.e., give up on the open attempt)](https://www.rfc-editor.org/info/rfc8558) [sooner, of course.](https://www.iana.org/assignments/tcp-parameters/)

#### 3.8.4. TCP Keep-Alives

[A TCP connection is said to be "idle" if for some long amount of time there have been no](https://www.rfc-editor.org/info/rfc1011) incoming segments received and there is no new or unacknowledged data to be sent.

Implementers [MAY](https://www.rfc-editor.org/errata/eid3301) [include "keep-alives" in their TCP implementations (MAY-5), although this](https://www.rfc-editor.org/ien/ien177.txt) [practice is not universally accepted. Some TCP implementations, however, have included a keep-](https://www.rfc-editor.org/info/rfc3168) [alive mechanism. To confirm that an idle connection is still active, these implementations send a](https://www.rfc-editor.org/info/rfc7323) [probe segment designed to elicit a response from the TCP peer. Such a segment generally](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) contains SEG.SEQ = SND.NXT-1 and may or may not contain one garbage octet of data. If keep- [alives are included, the application](https://www.rfc-editor.org/info/rfc9065) [MUST](https://www.rfc-editor.org/info/rfc5044) [be able to turn them on or off for each TCP connection](https://www.rfc-editor.org/info/rfc7413) (MUST-24), and they [MUST](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.4.2) default to off (MUST-25).

Keep-alive packets [MUST](https://www.rfc-editor.org/info/rfc1644) [only be sent when no sent data is outstanding, and no data or](https://www.rfc-editor.org/info/rfc5461) acknowledgment packets have been received for the connection within an interval (MUST-26). This interval MUST be configurable (MUST-27) and MUST [default to no less than two hours](https://www.rfc-editor.org/errata/eid1569) (MUST-28).

[It is extremely important to remember that ACK segments that contain no data are not reliably](https://www.rfc-editor.org/info/rfc7657) transmitted by TCP. Consequently, if a keep-alive mechanism is implemented it [MUST NOT](https://www.rfc-editor.org/info/rfc6298)

[interpret failure to respond to any specific probe as a dead connection (MUST-29).](https://www.rfc-editor.org/info/rfc5795)

An implementation [SHOULD](https://www.rfc-editor.org/info/rfc8087) [send a keep-alive segment with no data (SHLD-12); however, it](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) MAY

[be configurable to send a keep-alive segment containing one garbage octet (MAY-6), for](https://www.rfc-editor.org/info/rfc9293) compatibility with erroneous TCP implementations.

#### 3.8.5. [The Communication of Urgent Information](https://www.rfc-editor.org/info/rfc2883)

[As a result of implementation differences and middlebox interactions, new applications](https://www.rfc-editor.org/rfc/rfc6528) SHOULD

[NOT](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) employ the TCP urgent mechanism (SHLD-13). However, TCP implementations MUST still include support for the urgent mechanism (MUST-30). Information on how some TCP [implementations interpret the urgent pointer can be found in RFC 6093](https://www.rfc-editor.org/info/rfc8201) [39] .

The objective of the TCP urgent mechanism is to allow the sending user to stimulate the receiving [user to accept some urgent data and to permit the receiving TCP endpoint to indicate to the](https://www.rfc-editor.org/info/rfc1191) [receiving user when all the currently known urgent data has been received by the user.](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

This mechanism permits a point in the data stream to be designated as the end of urgent [information. Whenever this point is in advance of the receive sequence number (RCV.NXT) at the](https://www.rfc-editor.org/info/rfc8548) receiving TCP endpoint, then the TCP implementation must tell the user to go into "urgent mode"; [when the receive sequence number catches up to the urgent pointer, the TCP implementation](https://www.rfc-editor.org/info/rfc793) [must tell user to go into "normal mode". If the urgent pointer is updated while the user is in](https://www.rfc-editor.org/info/rfc8558) "urgent mode", the update will be invisible to the user.

[The method employs an urgent field that is carried in all segments transmitted. The URG control](https://www.rfc-editor.org/rfc/rfc6528#section-3) [flag indicates that the urgent field is meaningful and must be added to the segment sequence](https://www.rfc-editor.org/info/rfc2914) [number to yield the urgent pointer. The absence of this flag indicates that there is no urgent data](https://www.rfc-editor.org/info/rfc7094) outstanding.

[To send an urgent indication, the user must also send at least one data octet. If the sending user](https://www.rfc-editor.org/info/rfc3168) [also indicates a push, timely delivery of the urgent information to the destination process is](https://www.rfc-editor.org/info/rfc7323) [enhanced. Note that because changes in the urgent pointer correspond to data being written by a](https://www.rfc-editor.org/info/rfc1349) sending application, the urgent pointer cannot "recede" in the sequence space, but a TCP receiver [should be robust to invalid urgent pointer values.](https://www.rfc-editor.org/info/rfc5044)

A TCP implementation MUST [support a sequence of urgent data of any length (MUST-31)](https://www.rfc-editor.org/info/rfc5681) [[19]](https://www.rfc-editor.org/info/rfc5681) [.](https://www.rfc-editor.org/info/rfc5681)

The urgent pointer [MUST](https://www.rfc-editor.org/errata/eid1565) [point to the sequence number of the octet following the urgent data](https://www.rfc-editor.org/info/rfc7414) (MUST-62).

A TCP implementation [MUST](https://www.rfc-editor.org/info/rfc5570) [(MUST-32) inform the application layer asynchronously whenever it](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) [receives an urgent pointer and there was previously no pending urgent data, or whenever the](https://www.rfc-editor.org/info/rfc7657) urgent pointer advances in the data stream. The TCP implementation [MUST](https://www.rfc-editor.org/info/rfc6298) [(MUST-33) provide a](https://www.rfc-editor.org/info/rfc6298) [way for the application to learn how much urgent data remains to be read from the connection,](https://www.rfc-editor.org/info/rfc5795) [or at least to determine whether more urgent data remains to be read](https://www.rfc-editor.org/info/rfc8087) [[19]](https://www.rfc-editor.org/errata/eid1562) [.](https://www.rfc-editor.org/errata/eid1562)

#### 3.8.6. [Managing the Window](https://www.rfc-editor.org/errata/eid1562)

[The window sent in each segment indicates the range of sequence numbers the sender of the](https://www.rfc-editor.org/rfc/rfc793#section-2) [window (the data receiver) is currently prepared to accept. There is an assumption that this is](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [related to the data buffer space currently available for this connection.](https://www.rfc-editor.org/info/rfc2873)

[The sending TCP endpoint packages the data to be transmitted into segments that fit the current](https://www.rfc-editor.org/info/rfc5927) [window, and may repackage segments on the retransmission queue. Such repackaging is not](https://www.rfc-editor.org/info/rfc2883) required but may be helpful.

In a connection with a one-way data flow, the window information will be carried in [acknowledgment segments that all have the same sequence number, so there will be no way to](https://www.rfc-editor.org/info/rfc6429) [reorder them if they arrive out of order. This is not a serious problem, but it will allow the](https://www.rfc-editor.org/info/rfc791) window information to be on occasion temporarily based on old reports from the data receiver. A refinement to avoid this problem is to act on the window information from segments that [carry the highest acknowledgment number (that is, segments with an acknowledgment number](https://www.rfc-editor.org/info/rfc1191) [equal to or greater than the highest previously received).](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

[Indicating a large window encourages transmissions. If more data arrives than can be accepted,](https://www.rfc-editor.org/info/rfc6691) [it will be discarded. This will result in excessive retransmissions, adding unnecessarily to the](https://www.rfc-editor.org/info/rfc8548) [load on the network and the TCP endpoints. Indicating a small window may restrict the](https://www.rfc-editor.org/info/rfc6864) [transmission of data to the point of introducing a round-trip delay between each new segment](https://www.rfc-editor.org/info/rfc8558) [transmitted.](https://www.iana.org/assignments/tcp-parameters/)

[The mechanisms provided allow a TCP endpoint to advertise a large window and to subsequently](https://www.rfc-editor.org/rfc/rfc6528#section-3) [advertise a much smaller window without having accepted that much data. This so-called](https://www.rfc-editor.org/info/rfc1011) "shrinking the window" is strongly discouraged. The robustness principle [19] dictates that TCP [peers will not shrink the window themselves, but will be prepared for such behavior on the part](https://www.rfc-editor.org/info/rfc7094) of other TCP peers.

A TCP receiver SHOULD NOT [shrink the window, i.e., move the right window edge to the left](https://www.rfc-editor.org/info/rfc4953) [(SHLD-14). However, a sending TCP peer](https://www.rfc-editor.org/rfc/rfc5461#section-4) [MUST](https://www.rfc-editor.org/info/rfc7323) [be robust against window shrinking, which may](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) cause the "usable window" (see Section 3.8.6.2.1) to become negative (MUST-34).

If this happens, the sender [SHOULD NOT](https://www.rfc-editor.org/info/rfc9065) send new data (SHLD-15), but [SHOULD](https://www.rfc-editor.org/errata/eid574) [retransmit](https://www.rfc-editor.org/errata/eid574) normally the old unacknowledged data between SND.UNA and SND.UNA+SND.WND (SHLD-16). The sender MAY [also retransmit old data beyond SND.UNA+SND.WND (MAY-7), but](https://www.rfc-editor.org/info/rfc5461) [SHOULD NOT](https://www.rfc-editor.org/info/rfc5681)

time out the connection if data beyond the right window edge is not acknowledged (SHLD-17). If the window shrinks to zero, the TCP implementation [MUST](https://www.rfc-editor.org/errata/eid701) [probe it in the standard way](https://www.rfc-editor.org/errata/eid701) (described below) (MUST-35).

##### 3.8.6.1. [Zero-Window Probing](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00)

The sending TCP peer must regularly transmit at least one octet of new data (if available), or [retransmit to the receiving TCP peer even if the send window is zero, in order to "probe" the](https://www.rfc-editor.org/info/rfc5795) [window. This retransmission is essential to guarantee that when either TCP peer has a zero](https://www.rfc-editor.org/info/rfc8087) [window the reopening of the window will be reliably reported to the other. This is referred to as](https://www.rfc-editor.org/info/rfc6633) [Zero-Window Probing (ZWP) in other documents.](https://www.rfc-editor.org/info/rfc9293)

[Probing of zero (offered) windows](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [MUST](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [be supported (MUST-36).](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

| A TCP implementation | MAY  | keep its offered receive window closed indefinitely (MAY-8). As long |
| -------------------- | ---- | -------------------------------------------------------------------- |
| the sending TCP peer | MUST | allow the connection to stay open (MUST-37). This enables TCP to     |

[function in scenarios such as the "printer ran out of paper" situation described in](https://trustee.ietf.org/license-info) [Section 4.2.2.17](https://www.rfc-editor.org/info/rfc8200) of [19] [. The behavior is subject to the implementation's resource management concerns, as noted](https://www.rfc-editor.org/info/rfc2883) in [41] .

[When the receiving TCP peer has a zero window and a segment arrives, it must still send an](https://www.rfc-editor.org/info/rfc2923) [acknowledgment showing its next expected sequence number and current window (zero).](https://www.rfc-editor.org/info/rfc6429)

[The transmitting host](mailto:wes@mti-systems.com) [SHOULD](https://www.rfc-editor.org/info/rfc791) send the first zero-window probe when a zero window has existed for the retransmission timeout period (SHLD-29) (Section 3.8.1), and [SHOULD](https://www.rfc-editor.org/info/rfc8961) [increase](https://www.rfc-editor.org/info/rfc8961) exponentially the interval between successive probes (SHLD-30).

##### 3.8.6.2. Silly Window Syndrome Avoidance

[The "Silly Window Syndrome" (SWS) is a stable pattern of small incremental window movements](https://www.rfc-editor.org/info/rfc8548) resulting in extremely poor TCP performance. Algorithms to avoid SWS are described below for [both the sending side and the receiving side. RFC 1122 contains more detailed discussion of the](https://www.rfc-editor.org/info/rfc793) [SWS problem. Note that the Nagle algorithm and the sender SWS avoidance algorithm play](https://www.rfc-editor.org/info/rfc8558) [complementary roles in improving performance. The Nagle algorithm discourages sending tiny](https://www.rfc-editor.org/info/rfc2474) [segments when the data to be sent increases in small increments, while the SWS avoidance](https://www.rfc-editor.org/info/rfc6994) [algorithm discourages small segments resulting from the right window edge advancing in small](https://www.rfc-editor.org/rfc/rfc6528#section-3) increments.

###### 3.8.6.2.1. [Sender's Algorithm -- When to Send Data](https://www.rfc-editor.org/ien/ien177.txt)

A TCP implementation [MUST](https://www.rfc-editor.org/info/rfc3168) [include a SWS avoidance algorithm in the sender (MUST-38).](https://www.rfc-editor.org/info/rfc4953)

[The Nagle algorithm from Section 3.7.4 additionally describes how to coalesce short segments.](https://www.rfc-editor.org/info/rfc7323)

The sender's SWS avoidance algorithm is more difficult than the receiver's because the sender [does not know (directly) the receiver's total buffer space (RCV.BUFF). An approach that has been](https://www.rfc-editor.org/info/rfc5044) found to work well is for the sender to calculate Max(SND.WND), which is the maximum send [window it has seen so far on the connection, and to use this value as an estimate of RCV.BUFF.](https://www.rfc-editor.org/info/rfc5461) [Unfortunately, this can only be an estimate; the receiver may at any time reduce the size of](https://www.iana.org/assignments/tcp-parameters/) RCV.BUFF. To avoid a resulting deadlock, it is necessary to have a timeout to force transmission of [data, overriding the SWS avoidance algorithm. In practice, this timeout should seldom occur.](https://www.rfc-editor.org/info/rfc5961)

The "usable window" is:

## [U = SND.UNA + SND.WND - SND.NXT](https://www.rfc-editor.org/info/rfc6298)

[i.e., the offered window less the amount of data sent but not acknowledged. If D is the amount of](https://www.rfc-editor.org/info/rfc8087) [data queued in the sending TCP endpoint but not yet sent, then the following set of rules is](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4) [recommended.](https://www.rfc-editor.org/rfc/rfc8095#section-3.1)

Send data:

(1) if a maximum-sized segment can be sent, i.e., if:

min(D,U) >= Eff.snd.MSS;

(2) [or if the data is pushed and all queued data can be sent now, i.e., if:](https://trustee.ietf.org/license-info)

[[SND.NXT = SND.UNA and] PUSHed and D <= U](https://www.rfc-editor.org/info/rfc2883)

(the bracketed condition is imposed by the Nagle algorithm);

(3) [or if at least a fraction Fs of the maximum window can be sent, i.e., if:](https://www.rfc-editor.org/info/rfc6429)

[SND.NXT = SND.UNA and]

min(D,U) >= Fs * Max(SND.WND);

(4) [or if the override timeout occurs.](https://www.rfc-editor.org/errata/eid2749)

[Here Fs is a fraction whose recommended value is 1/2. The override timeout should be in the](https://www.rfc-editor.org/info/rfc8548) [range 0.1 - 1.0 seconds. It may be convenient to combine this timer with the timer used to probe](https://www.rfc-editor.org/info/rfc793) zero windows (Section 3.8.6.1).

###### 3.8.6.2.2. Receiver's Algorithm -- When to Send a Window Update

A TCP implementation MUST [include a SWS avoidance algorithm in the receiver (MUST-39).](https://www.rfc-editor.org/info/rfc4821)

The receiver's SWS avoidance algorithm determines when the right window edge may be [advanced; this is customarily known as "updating the window". This algorithm combines with](https://www.rfc-editor.org/info/rfc7094) [the delayed ACK algorithm (Section 3.8.6.3) to determine when an ACK segment containing the](https://www.rfc-editor.org/ien/ien177.txt) [current window will really be sent to the receiver.](https://www.rfc-editor.org/info/rfc3168)

[The solution to receiver SWS is to avoid advancing the right window edge RCV.NXT+RCV.WND in](https://www.rfc-editor.org/info/rfc7323) small increments, even if data is received from the network in small segments.

Suppose the total receive buffer space is RCV.BUFF. At any given moment, RCV.USER octets of this total may be tied up with data that has been received and acknowledged but that the user [process has not yet consumed. When the connection is quiescent, RCV.WND = RCV.BUFF and](https://www.rfc-editor.org/info/rfc5461) RCV.USER = 0.

[Keeping the right window edge fixed as data arrives and is acknowledged requires that the](https://www.rfc-editor.org/info/rfc5961) [receiver offer less than its full buffer space, i.e., the receiver must specify a RCV.WND that keeps](https://www.rfc-editor.org/info/rfc2018) [RCV.NXT+RCV.WND constant as RCV.NXT increases. Thus, the total buffer space RCV.BUFF is](https://www.rfc-editor.org/info/rfc7657) [generally divided into three parts:](https://www.rfc-editor.org/errata/eid2296)

```
|<------- RCV.BUFF ---------------->|
1 2 3
----|---------|------------------|------|----
RCV.NXT ^
(Fixed)
```

1 [-](https://www.rfc-editor.org/info/rfc8174) [RCV.USER](https://www.rfc-editor.org/rfc/rfc5961#section-5) [=](https://www.rfc-editor.org/info/rfc2873) [data](https://www.rfc-editor.org/info/rfc2873) [received but not yet consumed;](https://www.rfc-editor.org/errata/eid4772) 2 [-](https://www.rfc-editor.org/info/rfc2873) [RCV.WND](https://www.rfc-editor.org/rfc/rfc5961#section-5) [=](https://www.rfc-editor.org/rfc/rfc5961#section-5) [space advertised](https://www.rfc-editor.org/info/rfc2873) to [sender;](https://www.rfc-editor.org/errata/eid1571) 3 [-](https://www.rfc-editor.org/errata/eid1571) Reduction = space available but not yet [advertised.](https://www.rfc-editor.org/info/rfc8303)

[The suggested SWS avoidance algorithm for the receiver is to keep RCV.NXT+RCV.WND fixed until](https://www.rfc-editor.org/info/rfc5927) the reduction satisfies:

## [RCV.BUFF](https://www.rfc-editor.org/errata/eid2297) [-](https://www.rfc-editor.org/rfc/rfc5961) RCV.USER - RCV.WND >=

### [min(](https://www.rfc-editor.org/info/rfc8201) [Fr](https://www.rfc-editor.org/info/rfc8201) [*](https://www.rfc-editor.org/info/rfc8201) [RCV.BUFF,](https://www.rfc-editor.org/info/rfc6429) [Eff.snd.MSS](https://www.rfc-editor.org/errata/eid2298) [)](https://www.rfc-editor.org/errata/eid2298)

where Fr is a fraction whose recommended value is 1/2, and Eff.snd.MSS is the effective send MSS for the connection (see Section 3.7.1). When the inequality is satisfied, RCV.WND is set to RCV.BUFF-RCV.USER.

Note that the general effect of this algorithm is to advance RCV.WND in increments of Eff.snd.MSS [(for realistic receive buffers: Eff.snd.MSS < RCV.BUFF/2). Note also that the receiver must use its](https://www.rfc-editor.org/info/rfc6691) own Eff.snd.MSS, making the assumption that it is the same as the sender's.

##### 3.8.6.3. [Delayed Acknowledgments -- When to Send an ACK Segment](https://www.rfc-editor.org/info/rfc8558)

[A host that is receiving a stream of TCP data segments can increase efficiency in both the](https://www.rfc-editor.org/info/rfc2474) [network and the hosts by sending fewer than one ACK (acknowledgment) segment per data](https://www.rfc-editor.org/info/rfc6994) segment received; this is known as a "delayed ACK".

A TCP endpoint SHOULD implement a delayed ACK (SHLD-18), but an ACK should not be [excessively delayed; in particular, the delay](https://www.rfc-editor.org/info/rfc7094) [MUST](https://www.rfc-editor.org/info/rfc7094) [be less than 0.5 seconds (MUST-40). An ACK](https://www.rfc-editor.org/info/rfc4987) SHOULD [be generated for at least every second full-sized segment or 2*RMSS bytes of new data](https://www.rfc-editor.org/ien/ien177.txt) [(where RMSS is the MSS specified by the TCP endpoint receiving the segments to be](https://www.rfc-editor.org/info/rfc3168) [acknowledged, or the default value if not specified) (SHLD-19). Excessive delays on ACKs can](https://www.rfc-editor.org/info/rfc7323) [disturb the round-trip timing and packet "clocking" algorithms. More complete discussion of](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [delayed ACK behavior is in Section 4.2 of RFC 5681](https://www.rfc-editor.org/info/rfc5033) [8] [, including recommendations to](https://www.rfc-editor.org/errata/eid573) [immediately acknowledge out-of-order segments, segments above a gap in sequence space, or](https://www.rfc-editor.org/info/rfc5044) segments that fill all or part of a gap, in order to accelerate loss recovery.

[Note that there are several current practices that further lead to a reduced number of ACKs,](https://www.rfc-editor.org/info/rfc5461) including generic receive offload (GRO) [72] [, ACK compression, and ACK decimation](https://www.rfc-editor.org/info/rfc7414) [[28]](https://www.rfc-editor.org/info/rfc7414) [.](https://www.rfc-editor.org/info/rfc7414)

### 3.9. Interfaces

There are of course two interfaces of concern: the user/TCP interface and the TCP/lower-level interface. We have a fairly elaborate model of the user/TCP interface, but the interface to the [lower-level protocol module is left unspecified here since it will be specified in detail by the](https://www.rfc-editor.org/info/rfc5795) [specification of the lower-level protocol. For the case that the lower level is IP, we note some of](https://www.rfc-editor.org/info/rfc8087) the parameter values that TCP implementations might use.

#### 3.9.1. [User/TCP Interface](https://www.rfc-editor.org/errata/eid3602)

[The following functional description of user commands to the TCP implementation is, at best,](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [fictional, since every operating system will have different facilities. Consequently, we must warn](https://www.rfc-editor.org/info/rfc2873) readers that different TCP implementations may have different user interfaces. However, all TCP

[implementations must provide a certain minimum set of services to guarantee that all TCP](https://trustee.ietf.org/license-info) [implementations can support the same protocol hierarchy. This section specifies the functional](https://www.rfc-editor.org/info/rfc2883) [interfaces required of all TCP implementations.](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10)

Section 3.1 of [53] [also identifies primitives provided by TCP and could be used as an additional](https://www.rfc-editor.org/info/rfc2923) reference for implementers.

[The following sections functionally characterize a user/TCP interface. The notation used is](https://www.rfc-editor.org/info/rfc791) similar to most procedure or function calls in high-level languages, but this usage is not meant to rule out trap-type service calls.

The user commands described below specify the basic functions the TCP implementation must [perform to support interprocess communication. Individual implementations must define their](https://www.rfc-editor.org/info/rfc6691) [own exact format and may provide combinations or subsets of the basic functions in single calls.](https://www.rfc-editor.org/info/rfc8548) [In particular, some implementations may wish to automatically OPEN a connection on the first](https://www.rfc-editor.org/info/rfc793) [SEND or RECEIVE issued by the user for a given connection.](https://www.rfc-editor.org/info/rfc4727)

[In providing interprocess communication facilities, the TCP implementation must not only accept](https://www.rfc-editor.org/info/rfc2474) commands, but must also return information to the processes it serves. The latter consists of:

(a) [general information about a connection (e.g., interrupts, remote close, binding of](https://www.rfc-editor.org/info/rfc7094) unspecified remote socket).

(b) [replies to specific user commands indicating success or various types of failure.](https://www.rfc-editor.org/info/rfc3168)

##### 3.9.1.1. Open

Format: OPEN (local port, remote socket, active/passive [, timeout] [, Diffserv field] [, security/ [compartment] [, local IP address] [, options]) -> local connection name](https://www.rfc-editor.org/info/rfc5044)

If the active/passive flag is set to passive, then this is a call to LISTEN for an incoming connection. [A passive OPEN may have either a fully specified remote socket to wait for a particular](https://www.rfc-editor.org/info/rfc5461) connection or an unspecified remote socket to wait for any call. A fully specified passive call can be made active by the subsequent execution of a SEND.

[A transmission control block (TCB) is created and partially filled in with data from the OPEN](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) command parameters.

Every passive OPEN call either creates a new connection record in LISTEN state, or it returns an error; it MUST NOT affect any previously created connection record (MUST-41).

[A TCP implementation that supports multiple concurrent connections](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4) [MUST](https://www.rfc-editor.org/info/rfc6633) [provide an OPEN](https://www.rfc-editor.org/info/rfc6633) [call that will functionally allow an application to LISTEN on a port while a connection block with](https://www.rfc-editor.org/info/rfc9293) the same local port is in SYN-SENT or SYN-RECEIVED state (MUST-42).

[On an active OPEN command, the TCP endpoint will begin the procedure to synchronize (i.e.,](https://www.rfc-editor.org/info/rfc2873) establish) the connection at once.

[The timeout, if present, permits the caller to set up a timeout for all data submitted to TCP. If data](https://www.rfc-editor.org/info/rfc5927) [is not successfully delivered to the destination within the timeout period, the TCP endpoint will](https://www.rfc-editor.org/info/rfc2883) [abort the connection. The present global default is five minutes.](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10)

[The TCP implementation or some component of the operating system will verify the user's](https://www.rfc-editor.org/info/rfc2923) [authority to open a connection with the specified Diffserv field value or security/compartment.](https://www.rfc-editor.org/info/rfc6429) [The absence of a Diffserv field value or security/compartment specification in the OPEN call](https://www.rfc-editor.org/info/rfc791) indicates the default values must be used.

[TCP will accept incoming requests as matching only if the security/compartment information is](https://www.rfc-editor.org/info/rfc1191) [exactly the same as that requested in the OPEN call.](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

[The Diffserv field value indicated by the user only impacts outgoing packets, may be altered en](https://www.rfc-editor.org/info/rfc6691) [route through the network, and has no direct bearing or relation to received packets.](https://www.rfc-editor.org/info/rfc8548)

[A local connection name will be returned to the user by the TCP implementation. The local](https://www.rfc-editor.org/info/rfc793) [connection name can then be used as a shorthand term for the connection defined by the <local](https://www.rfc-editor.org/info/rfc8558) socket, remote socket> pair.

The optional "local IP address" parameter MUST [be supported to allow the specification of the](https://www.rfc-editor.org/info/rfc4821) [local IP address (MUST-43). This enables applications that need to select the local IP address used](https://www.rfc-editor.org/info/rfc2914) when multihoming is present.

[A passive OPEN call with a specified "local IP address" parameter will await an incoming](https://www.rfc-editor.org/info/rfc9000) [connection request to that address. If the parameter is unspecified, a passive OPEN will await an](https://www.rfc-editor.org/info/rfc3168) [incoming connection request to any local IP address and then bind the local IP address of the](https://www.rfc-editor.org/info/rfc7323) connection to the particular address that is used.

[For an active OPEN call, a specified "local IP address" parameter will be used for opening the](https://www.rfc-editor.org/info/rfc5044) connection. If the parameter is unspecified, the host will choose an appropriate local IP address (see RFC 1122, Section 3.3.4.2).

If an application on a multihomed host does not specify the local IP address when actively opening a TCP connection, then the TCP implementation [MUST](https://www.rfc-editor.org/errata/eid1569) [ask the IP layer to select a local IP](https://www.rfc-editor.org/errata/eid1569) [address before sending the (first) SYN (MUST-44). See the function GET_SRCADDR() in Section 3.4](https://www.rfc-editor.org/info/rfc5961) of RFC 1122.

At all other times, a previous segment has either been sent or received on this connection, and TCP implementations [MUST](https://www.rfc-editor.org/info/rfc6298) [use the same local address that was used in those previous segments](https://www.rfc-editor.org/info/rfc2525) (MUST-45).

A TCP implementation [MUST](https://www.rfc-editor.org/info/rfc9293) [reject as an error a local OPEN call for an invalid remote IP address](https://www.rfc-editor.org/info/rfc9293) (e.g., a broadcast or multicast address) (MUST-46).

##### 3.9.1.2. Send

Format: SEND (local connection name, buffer address, byte count, URGENT flag [, PUSH flag] [, timeout])

[This call causes the data contained in the indicated user buffer to be sent on the indicated](https://trustee.ietf.org/license-info) [connection. If the connection has not been opened, the SEND is considered an error. Some](https://www.rfc-editor.org/info/rfc2883) [implementations may allow users to SEND first; in which case, an automatic OPEN would be](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) done. For example, this might be one way for application data to be included in SYN segments. If the calling process is not authorized to use this connection, an error is returned.

[A TCP endpoint](mailto:wes@mti-systems.com) [MAY](https://www.rfc-editor.org/info/rfc9170) [implement PUSH flags on SEND calls (MAY-15). If PUSH flags are not](https://www.rfc-editor.org/info/rfc791) implemented, then the sending TCP peer: (1) MUST NOT [buffer data indefinitely (MUST-60), and](https://www.rfc-editor.org/errata/eid2748) (2) MUST [set the PSH bit in the last buffered segment (i.e., when there is no more queued data to](https://www.rfc-editor.org/rfc/rfc8200#section-8.1) [be sent) (MUST-61). The remaining description below assumes the PUSH flag is supported on](https://www.rfc-editor.org/info/rfc1191) SEND calls.

[If the PUSH flag is set, the application intends the data to be transmitted promptly to the receiver,](https://www.rfc-editor.org/info/rfc6691) and the PSH bit will be set in the last TCP segment created from the buffer.

[The PSH bit is not a record marker and is independent of segment boundaries. The transmitter](https://www.rfc-editor.org/info/rfc8558) [SHOULD](https://www.iana.org/assignments/tcp-parameters/) collapse successive bits when it packetizes data, to send the largest possible segment (SHLD-27).

[If the PUSH flag is not set, the data may be combined with data from subsequent SENDs for](https://www.rfc-editor.org/info/rfc2914) [transmission efficiency. When an application issues a series of SEND calls without setting the](https://www.rfc-editor.org/info/rfc1011) PUSH flag, the TCP implementation [MAY](https://www.rfc-editor.org/info/rfc7094) [aggregate the data internally without sending it](https://www.rfc-editor.org/info/rfc4987) [(MAY-16). Note that when the Nagle algorithm is in use, TCP implementations may buffer the](https://www.rfc-editor.org/ien/ien177.txt) [data before sending, without regard to the PUSH flag (see Section 3.7.4).](https://www.rfc-editor.org/info/rfc3168)

[An application program is logically required to set the PUSH flag in a SEND call whenever it](https://www.rfc-editor.org/info/rfc7323) needs to force delivery of the data to avoid a communication deadlock. However, a TCP implementation [SHOULD](https://www.rfc-editor.org/info/rfc5033) [send a maximum-sized segment whenever possible (SHLD-28) to](https://www.rfc-editor.org/info/rfc7413) [improve performance (see Section 3.8.6.2.1).](https://www.rfc-editor.org/info/rfc9065)

New applications SHOULD NOT [set the URGENT flag](https://www.rfc-editor.org/info/rfc5461) [[39]](https://www.rfc-editor.org/info/rfc5461) [due to implementation differences and](https://www.rfc-editor.org/info/rfc5681) middlebox issues (SHLD-13).

If the URGENT flag is set, segments sent to the destination TCP peer will have the urgent pointer [set. The receiving TCP peer will signal the urgent condition to the receiving process if the urgent](https://www.rfc-editor.org/info/rfc5961) [pointer indicates that data preceding the urgent pointer has not been consumed by the receiving](https://www.rfc-editor.org/info/rfc7657) process. The purpose of the URGENT flag is to stimulate the receiver to process the urgent data and to indicate to the receiver when all the currently known urgent data has been received. The [number of times the sending user's TCP implementation signals urgent will not necessarily be](https://www.rfc-editor.org/info/rfc5795) [equal to the number of times the receiving user will be notified of the presence of urgent data.](https://www.rfc-editor.org/info/rfc8087)

[If no remote socket was specified in the OPEN, but the connection is established (e.g., because a](https://www.rfc-editor.org/info/rfc9293) LISTENing connection has become specific due to a remote segment arriving for the local socket), [then the designated buffer is sent to the implied remote socket. Users who make use of OPEN](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [with an unspecified remote socket can make use of SEND without ever explicitly knowing the](https://www.rfc-editor.org/info/rfc2873) remote socket address.

[However, if a SEND is attempted before the remote socket becomes specified, an error will be](https://www.rfc-editor.org/info/rfc5927) [returned. Users can use the STATUS call to determine the status of the connection. Some TCP](https://www.rfc-editor.org/info/rfc2883) [implementations may notify the user when an unspecified socket is bound.](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10)

[If a timeout is specified, the current user timeout for this connection is changed to the new one.](https://www.rfc-editor.org/info/rfc2923)

[In the simplest implementation, SEND would not return control to the sending process until](https://www.rfc-editor.org/info/rfc9170) [either the transmission was complete or the timeout had been exceeded. However, this simple](https://www.rfc-editor.org/info/rfc791) method is both subject to deadlocks (for example, both sides of the connection might try to do [SENDs before doing any RECEIVEs) and offers poor performance, so it is not recommended. A](https://www.rfc-editor.org/info/rfc1191) [more sophisticated implementation would return immediately to allow the process to run](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) concurrently with network I/O, and, furthermore, to allow multiple SENDs to be in progress. [Multiple SENDs are served in first come, first served order, so the TCP endpoint will queue those](https://www.rfc-editor.org/info/rfc6691) it cannot service immediately.

[We have implicitly assumed an asynchronous user interface in which a SEND later elicits some](https://www.rfc-editor.org/info/rfc8558) kind of SIGNAL or pseudo-interrupt from the serving TCP endpoint. An alternative is to return a [response immediately. For instance, SENDs might return immediate local acknowledgment, even](https://www.rfc-editor.org/info/rfc2474) if the segment sent had not been acknowledged by the distant TCP endpoint. We could [optimistically assume eventual success. If we are wrong, the connection will close anyway due to](https://www.rfc-editor.org/info/rfc2914) the timeout. In implementations of this kind (synchronous), there will still be some [asynchronous signals, but these will deal with the connection itself, and not with specific](https://www.rfc-editor.org/info/rfc7094) segments or buffers.

[In order for the process to distinguish among error or success indications for different SENDs, it](https://www.rfc-editor.org/info/rfc4953) [might be appropriate for the buffer address to be returned along with the coded response to the](https://www.rfc-editor.org/info/rfc7323) [SEND request. TCP-to-user signals are discussed below, indicating the information that should be](https://www.rfc-editor.org/info/rfc1349) returned to the calling process.

##### 3.9.1.3. Receive

Format: RECEIVE (local connection name, buffer address, byte count) -> byte count, URGENT flag [, PUSH flag]

[This command allocates a receiving buffer associated with the specified connection. If no OPEN](https://www.rfc-editor.org/info/rfc5961) [precedes this command or the calling process is not authorized to use this connection, an error is](https://www.rfc-editor.org/info/rfc7657) returned.

[In the simplest implementation, control would not return to the calling program until either the](https://www.rfc-editor.org/info/rfc5795) [buffer was filled or some error occurred, but this scheme is highly subject to deadlocks. A more](https://www.rfc-editor.org/info/rfc8087) [sophisticated implementation would permit several RECEIVEs to be outstanding at once. These](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [would be filled as segments arrive. This strategy permits increased throughput at the cost of a](https://www.rfc-editor.org/info/rfc9293) [more elaborate scheme (possibly asynchronous) to notify the calling program that a PUSH has](https://www.rfc-editor.org/rfc/rfc793#section-2) been seen or a buffer filled.

A TCP receiver [MAY](https://trustee.ietf.org/license-info) [pass a received PSH bit to the application layer via the PUSH flag in the](https://www.rfc-editor.org/info/rfc5927) [interface (MAY-17), but it is not required (this was clarified in RFC 1122, Section 4.2.2.2). The](https://www.rfc-editor.org/info/rfc2883) [remainder of text describing the RECEIVE call below assumes that passing the PUSH indication is](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [supported.](https://www.rfc-editor.org/rfc/rfc8303#section-3.1)

[If enough data arrive to fill the buffer before a PUSH is seen, the PUSH flag will not be set in the](https://www.rfc-editor.org/info/rfc6429) [response to the RECEIVE. The buffer will be filled with as much data as it can hold. If a PUSH is](https://www.rfc-editor.org/info/rfc791) seen before the buffer is filled, the buffer will be returned partially filled and PUSH indicated.

[If there is urgent data, the user will have been informed as soon as it arrived via a TCP-to-user](https://www.rfc-editor.org/info/rfc1191) [signal. The receiving user should thus be in "urgent mode". If the URGENT flag is on, additional](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) urgent data remains. If the URGENT flag is off, this call to RECEIVE has returned all the urgent data, and the user may now leave "urgent mode". Note that data following the urgent pointer [(non-urgent data) cannot be delivered to the user in the same buffer with preceding urgent data](https://www.rfc-editor.org/info/rfc8548) unless the boundary is clearly marked for the user.

To distinguish among several outstanding RECEIVEs and to take care of the case that a buffer is [not completely filled, the return code is accompanied by both a buffer pointer and a byte count](https://www.rfc-editor.org/info/rfc2474) indicating the actual length of the data received.

[Alternative implementations of RECEIVE might have the TCP endpoint allocate buffer storage, or](https://www.rfc-editor.org/info/rfc1011) [the TCP endpoint might share a ring buffer with the user.](https://www.rfc-editor.org/info/rfc7094)

##### 3.9.1.4. Close

[Format: CLOSE (local connection name)](https://www.rfc-editor.org/info/rfc7323)

[This command causes the connection specified to be closed. If the connection is not open or the](https://www.rfc-editor.org/info/rfc1349) [calling process is not authorized to use this connection, an error is returned. Closing connections](https://www.rfc-editor.org/info/rfc5044) is intended to be a graceful operation in the sense that outstanding SENDs will be transmitted (and retransmitted), as flow control permits, until all have been serviced. Thus, it should be [acceptable to make several SEND calls, followed by a CLOSE, and expect all the data to be sent to](https://www.rfc-editor.org/info/rfc5461) the destination. It should also be clear that users should continue to RECEIVE on CLOSING connections since the remote peer may be trying to transmit the last of its data. Thus, CLOSE [means "I have no more to send" but does not mean "I will not receive any more." It may happen](https://www.rfc-editor.org/info/rfc5961) [(if the user-level protocol is not well thought out) that the closing side is unable to get rid of all its](https://www.rfc-editor.org/info/rfc7657) data before timing out. In this event, CLOSE turns into ABORT, and the closing TCP peer gives up.

[The user may CLOSE the connection at any time on their own initiative, or in response to various](https://www.rfc-editor.org/info/rfc5795) [prompts from the TCP implementation (e.g., remote close executed, transmission timeout](https://www.rfc-editor.org/info/rfc8087) [exceeded, destination inaccessible).](https://www.rfc-editor.org/errata/eid1562)

Because closing a connection requires communication with the remote TCP peer, connections [may remain in the closing state for a short time. Attempts to reopen the connection before the](https://www.rfc-editor.org/rfc/rfc793#section-2) [TCP peer replies to the CLOSE command will result in error responses.](https://www.rfc-editor.org/info/rfc2873)

Close also implies push function.

##### 3.9.1.5. Status

[Format: STATUS (local connection name) -> status data](https://www.rfc-editor.org/info/rfc8311)

This is an implementation-dependent user command and could be excluded without adverse [effect. Information returned would typically come from the TCB associated with the connection.](https://www.rfc-editor.org/info/rfc2923)

[This command returns a data block containing the following information:](https://www.rfc-editor.org/info/rfc791)

local socket,

remote socket,

local connection name,

receive window,

[send window,](https://www.rfc-editor.org/rfc/rfc5570#section-7.3.1)

connection state,

number of buffers awaiting acknowledgment,

number of buffers pending receipt,

urgent state,

Diffserv field value,

[security/compartment, and](https://www.rfc-editor.org/info/rfc9000)

transmission timeout.

Depending on the state of the connection, or on the implementation itself, some of this information may not be available or meaningful. If the calling process is not authorized to use [this connection, an error is returned. This prevents unauthorized processes from gaining](https://www.rfc-editor.org/info/rfc5044) information about a connection.

##### 3.9.1.6. Abort

Format: ABORT (local connection name)

[This command causes all pending SENDs and RECEIVES to be aborted, the TCB to be removed,](https://www.rfc-editor.org/info/rfc5570) [and a special RST message to be sent to the remote TCP peer of the connection. Depending on the](https://www.rfc-editor.org/info/rfc7657) implementation, users may receive abort indications for each outstanding SEND or RECEIVE, or [may simply receive an ABORT-acknowledgment.](https://www.rfc-editor.org/info/rfc6298)

##### 3.9.1.7. Flush

[Some TCP implementations have included a FLUSH call, which will empty the TCP send queue of](https://www.rfc-editor.org/info/rfc9293) [any data that the user has issued SEND calls for but is still to the right of the current send](https://www.rfc-editor.org/rfc/rfc793#section-2) [window. That is, it flushes as much queued send data as possible without losing sequence](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [number synchronization. The FLUSH call](https://www.rfc-editor.org/info/rfc8174) [MAY](https://www.rfc-editor.org/info/rfc2873) [be implemented (MAY-14).](https://www.rfc-editor.org/errata/eid1571)

##### 3.9.1.8. [Asynchronous Reports](https://trustee.ietf.org/license-info)

There MUST [be a mechanism for reporting soft TCP error conditions to the application (MUST-47).](https://www.rfc-editor.org/info/rfc2883) [Generically, we assume this takes the form of an application-supplied ERROR_REPORT routine](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [that may be upcalled asynchronously from the transport layer:](https://www.rfc-editor.org/rfc/rfc5961)

[ERROR_REPORT(local connection name, reason, subreason)](https://www.rfc-editor.org/info/rfc8201)

The precise encoding of the reason and subreason parameters is not specified here. However, the conditions that are reported asynchronously to the application [MUST](https://www.rfc-editor.org/info/rfc8961) [include:](https://www.rfc-editor.org/info/rfc8961)

- [ICMP error message arrived (see Section 3.9.2.2 for description of handling each ICMP](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [message type since some message types need to be suppressed from generating reports to](https://www.rfc-editor.org/info/rfc6691) the application)

- Excessive retransmissions (see Section 3.8.3)

- [Urgent pointer advance (see Section 3.8.5)](https://doi.org/10.1016/0376-5075(78)90053-3)

[However, an application program that does not want to receive such ERROR_REPORT calls](https://www.rfc-editor.org/info/rfc2474) SHOULD be able to effectively disable these calls (SHLD-20).

##### 3.9.1.9. [Set Differentiated Services Field (IPv4 TOS or IPv6 Traffic Class)](https://www.rfc-editor.org/info/rfc1011)

The application layer [MUST](https://www.rfc-editor.org/info/rfc7094) [be able to specify the Differentiated Services field for segments that](https://www.rfc-editor.org/info/rfc4987) [are sent on a connection (MUST-48). The Differentiated Services field includes the 6-bit](https://www.rfc-editor.org/ien/ien177.txt) [Differentiated Services Codepoint (DSCP) value. It is not required, but the application](https://www.rfc-editor.org/info/rfc3168) SHOULD be [able to change the Differentiated Services field during the connection lifetime (SHLD-21). TCP](https://www.rfc-editor.org/info/rfc7323) implementations [SHOULD](https://www.rfc-editor.org/rfc/rfc5461#section-4) [pass the current Differentiated Services field value without change to](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) the IP layer, when it sends segments on the connection (SHLD-22).

The Differentiated Services field will be specified independently in each direction on the connection, so that the receiver application will specify the Differentiated Services field used for ACK segments.

TCP implementations MAY [pass the most recently received Differentiated Services field up to the](https://www.rfc-editor.org/errata/eid701) application (MAY-9).

#### 3.9.2. [TCP/Lower-Level Interface](https://www.rfc-editor.org/info/rfc7657)

The TCP endpoint calls on a lower-level protocol module to actually send and receive [information over a network. The two current standard Internet Protocol (IP) versions layered](https://www.rfc-editor.org/info/rfc5795) below TCP are IPv4 [[1]](https://www.rfc-editor.org/info/rfc8087) [and IPv6](https://www.rfc-editor.org/info/rfc8087) [[13]](https://www.rfc-editor.org/info/rfc8087) [.](https://www.rfc-editor.org/info/rfc8087)

[If the lower-level protocol is IPv4, it provides arguments for a type of service (used within the](https://www.rfc-editor.org/info/rfc9293) [Differentiated Services field) and for a time to live. TCP uses the following settings for these](https://www.rfc-editor.org/rfc/rfc793#section-2) parameters:

Diffserv field: The IP header value for the Diffserv field is given by the user. This includes the bits of the Diffserv Codepoint (DSCP).

Time to Live (TTL): [The TTL value used to send TCP segments](https://trustee.ietf.org/license-info) [MUST](https://www.rfc-editor.org/info/rfc8200) [be configurable (MUST-49).](https://www.rfc-editor.org/rfc/rfc1122#section-4.2.2.2)

- [Note that RFC 793 specified one minute (60 seconds) as a constant for the TTL because the](https://www.rfc-editor.org/info/rfc2883) [assumed maximum segment lifetime was two minutes. This was intended to explicitly ask](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [that a segment be destroyed if it could not be delivered by the internet system within one](https://www.rfc-editor.org/info/rfc2923) [minute. RFC 1122 updated RFC 793 to require that the TTL be configurable.](https://www.rfc-editor.org/info/rfc6429)

- [Note that the Diffserv field is permitted to change during a connection (Section 4.2.4.2 of](https://www.rfc-editor.org/info/rfc791) RFC 1122). However, the application interface might not support this ability, and the [application does not have knowledge about individual TCP segments, so this can only be](https://www.rfc-editor.org/rfc/rfc8200#section-8.1) [done on a coarse granularity, at best. This limitation is further discussed in RFC 7657](https://www.rfc-editor.org/info/rfc1191) [(Sections 5.1, 5.3, and 6)](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [[50]](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [. Generally, an application](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [SHOULD NOT](https://www.rfc-editor.org/info/rfc3465) [change the Diffserv](https://www.rfc-editor.org/info/rfc3465) field value during the course of a connection (SHLD-23).

Any lower-level protocol will have to provide the source address, destination address, and [protocol fields, and some way to determine the "TCP length", both to provide the functional](https://www.rfc-editor.org/info/rfc793) [equivalent service of IP and to be used in the TCP checksum.](https://www.rfc-editor.org/info/rfc4727)

[When received options are passed up to TCP from the IP layer, a TCP implementation](https://www.rfc-editor.org/info/rfc896) MUST

ignore options that it does not understand (MUST-50).

A TCP implementation [MAY](https://doi.org/10.1109/INFCOM.1999.752180) [support the Timestamp (MAY-10) and Record Route (MAY-11)](https://www.rfc-editor.org/info/rfc1011) Options.

##### 3.9.2.1. [Source Routing](https://www.rfc-editor.org/info/rfc1122)

[If the lower level is IP (or other protocol that provides this feature) and source routing is used,](https://www.rfc-editor.org/info/rfc7323) [the interface must allow the route information to be communicated. This is especially important](https://www.rfc-editor.org/info/rfc1349) so that the source and destination addresses used in the TCP checksum be the originating source [and ultimate destination. It is also important to preserve the return route to answer connection](https://www.rfc-editor.org/info/rfc5044) requests.

| An application      | MUST | be able to specify a source route when it actively opens a TCP connection |
| ------------------- | ---- | ------------------------------------------------------------------------- |
| (MUST-51), and this | MUST | take precedence over a source route received in a datagram (MUST-52).     |

[When a TCP connection is OPENed passively and a packet arrives with a completed IP Source](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [Route Option (containing a return route), TCP implementations](https://www.rfc-editor.org/info/rfc7657) [MUST](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) [save the return route and](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) use it for all segments sent on this connection (MUST-53). If a different source route arrives in a later segment, the later definition SHOULD [override the earlier one (SHLD-24).](https://www.rfc-editor.org/errata/eid1561)

##### 3.9.2.2. ICMP Messages

TCP implementations MUST [act on an ICMP error message passed up from the IP layer, directing](https://www.rfc-editor.org/info/rfc9293) it to the connection that created the error (MUST-54). The necessary demultiplexing information can be found in the IP header contained within the ICMP message.

[This applies to ICMPv6 in addition to IPv4 ICMP.](https://www.rfc-editor.org/rfc/rfc5961#section-5)

- [contains discussion of specific ICMP and ICMPv6 messages classified as either "soft" or](https://www.rfc-editor.org/info/rfc5927) ["hard" errors that may bear different responses. Treatment for classes of ICMP messages is](https://www.rfc-editor.org/info/rfc2883) described below:

Source Quench TCP implementations [MUST](https://www.rfc-editor.org/info/rfc8201) silently discard any received ICMP Source Quench messages [(MUST-55). See](mailto:wes@mti-systems.com) [[11]](mailto:wes@mti-systems.com) [for discussion.](https://www.rfc-editor.org/info/rfc791)

Soft Errors [For IPv4 ICMP, these include: Destination Unreachable -- codes 0, 1, 5; Time Exceeded -- codes 0,](https://www.rfc-editor.org/info/rfc1191) 1; and Parameter Problem.

[For ICMPv6, these include: Destination Unreachable -- codes 0, 3; Time Exceeded -- codes 0, 1;](https://www.rfc-editor.org/info/rfc8548) [and Parameter Problem -- codes 0, 1, 2.](https://www.rfc-editor.org/errata/eid2934)

[Since these Unreachable messages indicate soft error conditions, a TCP implementation](https://www.rfc-editor.org/info/rfc8558) [MUST](https://www.iana.org/assignments/tcp-parameters/)

[NOT](https://www.iana.org/assignments/tcp-parameters/) abort the connection (MUST-56), and it [SHOULD](https://www.rfc-editor.org/info/rfc2474) [make the information available to the](https://www.rfc-editor.org/info/rfc2474) application (SHLD-25).

Hard Errors For ICMP these include Destination Unreachable -- codes 2-4.

These are hard error conditions, so TCP implementations [SHOULD](https://www.rfc-editor.org/ien/ien177.txt) [abort the connection](https://www.rfc-editor.org/info/rfc1122) (SHLD-26). [35] [notes that some implementations do not abort connections when an ICMP hard](https://www.rfc-editor.org/info/rfc4953) [error is received for a connection that is in any of the synchronized states.](https://www.rfc-editor.org/info/rfc7323)

Note that [35], Section 4 [describes widespread implementation behavior that treats soft errors as](https://www.rfc-editor.org/info/rfc1349) [hard errors during connection establishment.](https://www.rfc-editor.org/info/rfc5033)

##### 3.9.2.3. [Source Address Validation](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.4.2)

[RFC 1122 requires addresses to be validated in incoming SYN packets:](https://www.rfc-editor.org/info/rfc5461)

[An incoming SYN with an invalid source address](https://www.rfc-editor.org/info/rfc5961) [MUST](https://www.rfc-editor.org/info/rfc2018) [be ignored either by TCP or by](https://www.rfc-editor.org/errata/eid1283) [the IP layer [(MUST-63)] (see Section 3.2.1.3).](https://www.rfc-editor.org/info/rfc5570)

A TCP implementation MUST [silently discard an incoming SYN segment that is addressed](https://www.rfc-editor.org/errata/eid1561) [to a broadcast or multicast address [(MUST-57)].](https://www.rfc-editor.org/info/rfc6298)

[This prevents connection state and replies from being erroneously generated, and implementers](https://www.rfc-editor.org/info/rfc9293) [should note that this guidance is applicable to all incoming segments, not just SYNs, as](https://www.rfc-editor.org/rfc/rfc793#section-2) [specifically indicated in RFC 1122.](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

### 3.10. [Event Processing](https://www.rfc-editor.org/rfc/rfc9293)

[The processing depicted in this section is an example of one possible implementation. Other](https://www.rfc-editor.org/rfc/rfc6528) [implementations may have slightly different processing sequences, but they should differ from](https://www.rfc-editor.org/info/rfc2923) [those in this section only in detail, not in substance.](https://www.rfc-editor.org/info/rfc8201)

The activity of the TCP endpoint can be characterized as responding to events. The events that occur can be cast into three categories: user calls, arriving segments, and timeouts. This section [describes the processing the TCP endpoint does in response to each of the events. In many cases,](https://www.rfc-editor.org/info/rfc1191) [the processing required depends on the state of the connection.](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

Events that occur:

[User Calls](https://www.rfc-editor.org/rfc/rfc5570#section-7.3.1)

## OPEN

## SEND

## RECEIVE

## CLOSE

## ABORT

## STATUS

Arriving Segments

## [SEGMENT ARRIVES](https://www.rfc-editor.org/rfc/rfc5461#section-4)

Timeouts

## USER TIMEOUT

## [RETRANSMISSION TIMEOUT](https://www.rfc-editor.org/info/rfc1644)

## TIME-WAIT TIMEOUT

[The model of the TCP/user interface is that user commands receive an immediate return and](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [possibly a delayed response via an event or pseudo-interrupt. In the following descriptions, the](https://www.rfc-editor.org/info/rfc7657) [term "signal" means cause a delayed response.](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00)

[Error responses in this document are identified by character strings. For example, user](https://www.rfc-editor.org/info/rfc5795) [commands referencing connections that do not exist receive "error: connection not open".](https://www.rfc-editor.org/info/rfc8087)

[Please note in the following that all arithmetic on sequence numbers, acknowledgment numbers,](https://www.rfc-editor.org/info/rfc9293)

windows, et cetera, is modulo 2 32 [(the size of the sequence number space). Also note that "=<"](https://www.rfc-editor.org/errata/eid1564)

[means less than or equal to (modulo 2](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [32](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [).](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

[A natural way to think about processing incoming segments is to imagine that they are first](https://trustee.ietf.org/license-info) [tested for proper sequence number (i.e., that their contents lie in the range of the expected](https://www.rfc-editor.org/info/rfc2883) ["receive window" in the sequence number space) and then that they are generally queued and](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [processed in sequence number order.](https://www.rfc-editor.org/rfc/rfc1011)

[When a segment overlaps other already received segments, we reconstruct the segment to](https://www.rfc-editor.org/info/rfc6429) [contain just the new data and adjust the header fields to be consistent.](https://www.rfc-editor.org/info/rfc791)

Note that if no state change is mentioned, the TCP connection stays in the same state.

#### 3.10.1. OPEN Call

[CLOSED STATE (i.e., TCB does not exist)](https://www.rfc-editor.org/info/rfc3465)

- [Create a new transmission control block (TCB) to hold connection state information. Fill in](https://www.rfc-editor.org/info/rfc8548) [local socket identifier, remote socket, Diffserv field, security/compartment, and user timeout](https://www.rfc-editor.org/info/rfc793) [information. Note that some parts of the remote socket may be unspecified in a passive](https://www.rfc-editor.org/info/rfc8558) [OPEN and are to be filled in by the parameters of the incoming SYN segment. Verify the](https://www.rfc-editor.org/info/rfc2474) [security and Diffserv value requested are allowed for this user, if not, return "error: Diffserv](https://www.rfc-editor.org/info/rfc896) [value not allowed" or "error: security/compartment not allowed". If passive, enter the](https://www.rfc-editor.org/rfc/rfc6528#section-3) [LISTEN state and return. If active and the remote socket is unspecified, return "error: remote](https://www.rfc-editor.org/info/rfc2914) socket unspecified"; if active and the remote socket is specified, issue a SYN segment. An [initial send sequence number (ISS) is selected. A SYN segment of the form](https://www.rfc-editor.org/info/rfc7094) [<SEQ=ISS><CTL=SYN> is sent. Set SND.UNA to ISS, SND.NXT to ISS+1, enter SYN-SENT state,](https://www.rfc-editor.org/ien/ien177.txt) and return.

- [If the caller does not have access to the local socket specified, return "error: connection](https://www.rfc-editor.org/info/rfc7323) illegal for this process". If there is no room to create a new connection, return "error: insufficient resources".

## LISTEN STATE

- [If the OPEN call is active and the remote socket is specified, then change the connection from](https://www.rfc-editor.org/info/rfc5461) passive to active, select an ISS. Send a SYN segment, set SND.UNA to ISS, SND.NXT to ISS+1. Enter SYN-SENT state. Data associated with SEND may be sent with SYN segment or queued [for transmission after entering ESTABLISHED state. The urgent bit if requested in the](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [command must be sent with the data segments sent as a result of this command. If there is](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) no room to queue the request, respond with "error: insufficient resources". If the remote socket was not specified, then return "error: remote socket unspecified".

## SYN-SENT STATE

## SYN-RECEIVED STATE

## ESTABLISHED STATE

## FIN-WAIT-1 STATE

## FIN-WAIT-2 STATE

## CLOSE-WAIT STATE

## CLOSING STATE

## [LAST-ACK STATE](https://www.rfc-editor.org/rfc/rfc8303#section-3.1)

## TIME-WAIT STATE

- Return "error: connection already exists".

#### 3.10.2. SEND Call

CLOSED STATE (i.e., TCB does not exist)

- [If the user does not have access to such a connection, then return "error: connection illegal](https://www.rfc-editor.org/info/rfc8548) for this process".

- [Otherwise, return "error: connection does not exist".](https://doi.org/10.1016/0376-5075(78)90053-3)

## LISTEN STATE

- [If the remote socket is specified, then change the connection from passive to active, select an](https://www.rfc-editor.org/rfc/rfc6528#section-3) [ISS. Send a SYN segment, set SND.UNA to ISS, SND.NXT to ISS+1. Enter SYN-SENT state. Data](https://www.rfc-editor.org/info/rfc2914) [associated with SEND may be sent with SYN segment or queued for transmission after](https://www.rfc-editor.org/info/rfc7094) entering ESTABLISHED state. The urgent bit if requested in the command must be sent with [the data segments sent as a result of this command. If there is no room to queue the request,](https://www.rfc-editor.org/info/rfc3168) [respond with "error: insufficient resources". If the remote socket was not specified, then](https://www.rfc-editor.org/info/rfc4953) [return "error: remote socket unspecified".](https://www.rfc-editor.org/info/rfc7323)

## SYN-SENT STATE

## SYN-RECEIVED STATE

- [Queue the data for transmission after entering ESTABLISHED state. If no space to queue,](https://www.rfc-editor.org/info/rfc5461) respond with "error: insufficient resources".

## ESTABLISHED STATE

## CLOSE-WAIT STATE

- Segmentize the buffer and send it with a piggybacked acknowledgment (acknowledgment [value = RCV.NXT). If there is insufficient space to remember this buffer, simply return "error:](https://www.rfc-editor.org/info/rfc2525) insufficient resources".

- [If the URGENT flag is set, then SND.UP <- SND.NXT and set the urgent pointer in the outgoing](https://www.rfc-editor.org/info/rfc9293) [segments.](https://www.rfc-editor.org/rfc/rfc8095#section-3.1)

## FIN-WAIT-1 STATE

## FIN-WAIT-2 STATE

## CLOSING STATE

## LAST-ACK STATE

## TIME-WAIT STATE

- [•](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) Return "error: connection closing" and do not service request.

#### 3.10.3. RECEIVE Call

CLOSED STATE (i.e., TCB does not exist)

- [If the user does not have access to such a connection, return "error: connection illegal for](https://www.rfc-editor.org/info/rfc1191) this process".

- Otherwise, return "error: connection does not exist".

## LISTEN STATE

## SYN-SENT STATE

## SYN-RECEIVED STATE

- [Queue for processing after entering ESTABLISHED state. If there is no room to queue this](https://www.rfc-editor.org/rfc/rfc6528#section-3) request, respond with "error: insufficient resources".

## ESTABLISHED STATE

## FIN-WAIT-1 STATE

## FIN-WAIT-2 STATE

- If insufficient incoming segments are queued to satisfy the request, queue the request. If [there is no queue space to remember the RECEIVE, respond with "error: insufficient](https://www.rfc-editor.org/info/rfc5044) resources".

- [Reassemble queued incoming segments into receive buffer and return to user. Mark "push](https://www.rfc-editor.org/info/rfc5461) [seen" (PUSH) if this is the case.](https://www.rfc-editor.org/errata/eid1565)

- If RCV.UP is in advance of the data currently being passed to the user, notify the user of the presence of urgent data.

- [When the TCP endpoint takes responsibility for delivering data to the user, that fact must be](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) communicated to the sender via an acknowledgment. The formation of such an acknowledgment is described below in the discussion of processing an incoming segment.

## CLOSE-WAIT STATE

- [Since the remote side has already sent FIN, RECEIVEs must be satisfied by data already on](https://www.rfc-editor.org/info/rfc9293) hand, but not yet delivered to the user. If no text is awaiting delivery, the RECEIVE will get an ["error: connection closing" response. Otherwise, any remaining data can be used to satisfy](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) the RECEIVE.

## CLOSING STATE

## LAST-ACK STATE

## TIME-WAIT STATE

- [Return "error: connection closing".](https://www.rfc-editor.org/rfc/rfc9293)

#### [3.10.4.](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [CLOSE Call](https://www.rfc-editor.org/rfc/rfc2525#section-2.17)

[CLOSED STATE (i.e., TCB does not exist)](https://www.rfc-editor.org/info/rfc8201)

- If the user does not have access to such a connection, return "error: connection illegal for this process".

- Otherwise, return "error: connection does not exist".

## LISTEN STATE

- [Any outstanding RECEIVEs are returned with "error: closing" responses. Delete TCB, enter](https://www.rfc-editor.org/info/rfc8548) [CLOSED state, and return.](https://www.rfc-editor.org/errata/eid2934)

## [SYN-SENT STATE](https://www.iana.org/assignments/tcp-parameters/)

- [Delete the TCB and return "error: closing" responses to any queued SENDs, or RECEIVEs.](https://www.rfc-editor.org/info/rfc6994)

## SYN-RECEIVED STATE

- [If no SENDs have been issued and there is no pending data to send, then form a FIN segment](https://www.rfc-editor.org/info/rfc4987) [and send it, and enter FIN-WAIT-1 state; otherwise, queue for processing after entering](https://www.rfc-editor.org/ien/ien177.txt) ESTABLISHED state.

## ESTABLISHED STATE

- [Queue this until all preceding SENDs have been segmentized, then form a FIN segment and](https://www.rfc-editor.org/info/rfc5044) [send it. In any case, enter FIN-WAIT-1 state.](https://www.rfc-editor.org/info/rfc9065)

## FIN-WAIT-1 STATE

## FIN-WAIT-2 STATE

- [Strictly speaking, this is an error and should receive an "error: connection closing" response.](https://www.rfc-editor.org/info/rfc2018) [An "ok" response would be acceptable, too, as long as a second FIN is not emitted (the first](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) [FIN may be retransmitted, though).](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00)

## CLOSE-WAIT STATE

- [Queue this request until all preceding SENDs have been segmentized; then send a FIN](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [segment, enter LAST-ACK state.](https://www.rfc-editor.org/errata/eid1562)

## CLOSING STATE

## LAST-ACK STATE

## TIME-WAIT STATE

- [Respond with "error: connection closing".](https://www.rfc-editor.org/info/rfc8311)

#### [3.10.5.](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [ABORT Call](https://www.rfc-editor.org/rfc/rfc2525#section-2.17)

[CLOSED STATE (i.e., TCB does not exist)](https://www.rfc-editor.org/info/rfc8201)

- If the user should not have access to such a connection, return "error: connection illegal for this process".

- Otherwise, return "error: connection does not exist".

## LISTEN STATE

- [Any outstanding RECEIVEs should be returned with "error: connection reset" responses.](https://www.rfc-editor.org/info/rfc8548) Delete TCB, enter CLOSED state, and return.

## [SYN-SENT STATE](https://www.iana.org/assignments/tcp-parameters/)

- [All queued SENDs and RECEIVEs should be given "connection reset" notification. Delete the](https://www.rfc-editor.org/info/rfc6994) TCB, enter CLOSED state, and return.

## SYN-RECEIVED STATE

## ESTABLISHED STATE

## FIN-WAIT-1 STATE

## FIN-WAIT-2 STATE

## CLOSE-WAIT STATE

- Send a reset segment:

## [<SEQ=SND.NXT><CTL=RST>](https://www.iana.org/assignments/tcp-parameters/)

- All queued SENDs and RECEIVEs should be given "connection reset" notification; all [segments queued for transmission (except for the RST formed above) or retransmission](https://www.rfc-editor.org/info/rfc5961) [should be flushed. Delete the TCB, enter CLOSED state, and return.](https://www.rfc-editor.org/info/rfc5570)

## CLOSING STATE

## LAST-ACK STATE

## TIME-WAIT STATE

- Respond with "ok" and delete the TCB, enter CLOSED state, and return.

#### 3.10.6. STATUS Call

[CLOSED STATE (i.e., TCB does not exist)](https://www.rfc-editor.org/rfc/rfc793)

- [If the user should not have access to such a connection, return "error: connection illegal for](https://www.rfc-editor.org/info/rfc2923) this process".

- [Otherwise, return "error: connection does not exist".](https://www.rfc-editor.org/info/rfc791)

## LISTEN STATE

- [Return "state = LISTEN" and the TCB pointer.](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

## SYN-SENT STATE

- Return "state = SYN-SENT" and the TCB pointer.

## [SYN-RECEIVED STATE](https://www.iana.org/assignments/tcp-parameters/)

- Return "state = SYN-RECEIVED" and the TCB pointer.

## ESTABLISHED STATE

- [Return "state = ESTABLISHED" and the TCB pointer.](https://www.rfc-editor.org/info/rfc7094)

## FIN-WAIT-1 STATE

- [Return "state = FIN-WAIT-1" and the TCB pointer.](https://www.rfc-editor.org/info/rfc7323)

## FIN-WAIT-2 STATE

- [Return "state = FIN-WAIT-2" and the TCB pointer.](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.4.2)

## CLOSE-WAIT STATE

- Return "state = CLOSE-WAIT" and the TCB pointer.

## CLOSING STATE

- Return "state = CLOSING" and the TCB pointer.

## LAST-ACK STATE

- [Return "state = LAST-ACK" and the TCB pointer.](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04)

## [TIME-WAIT STATE](https://www.rfc-editor.org/rfc/rfc8095#section-3.1)

- [Return "state = TIME-WAIT" and the TCB pointer.](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

#### 3.10.7. [SEGMENT ARRIVES](https://www.rfc-editor.org/info/rfc8200)

##### [3.10.7.1.](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [CLOSED STATE](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10)

If the state is CLOSED (i.e., TCB does not exist), then

[all data in the incoming segment is discarded. An incoming segment containing a RST is](https://www.rfc-editor.org/info/rfc791) discarded. An incoming segment not containing a RST causes a RST to be sent in response. The acknowledgment and sequence field values are selected to make the reset sequence acceptable to the TCP endpoint that sent the offending segment.

If the ACK bit is off, sequence number zero is used,

## <SEQ=0><ACK=SEG.SEQ+SEG.LEN><CTL=RST,ACK>

If the ACK bit is on,

## [<SEQ=SEG.ACK><CTL=RST>](https://www.rfc-editor.org/info/rfc4727)

Return.

##### 3.10.7.2. [LISTEN STATE](https://doi.org/10.1109/INFCOM.1999.752180)

If the state is LISTEN, then

First, check for a RST:

- [An incoming RST segment could not be valid since it could not have been sent in response](https://www.rfc-editor.org/info/rfc4953) [to anything sent by this incarnation of the connection. An incoming RST should be ignored.](https://www.rfc-editor.org/info/rfc7323) Return.

[Second, check for an ACK:](https://www.rfc-editor.org/info/rfc9065)

- Any acknowledgment is bad if it arrives on a connection still in the LISTEN state. An [acceptable reset segment should be formed for any arriving ACK-bearing segment. The RST](https://www.rfc-editor.org/info/rfc5461) [should be formatted as follows:](https://www.rfc-editor.org/errata/eid1565)

## <SEQ=SEG.ACK><CTL=RST>

- Return.

Third, check for a SYN:

- [If the SYN bit is set, check the security. If the security/compartment on the incoming](https://www.rfc-editor.org/info/rfc5795) [segment does not exactly match the security/compartment in the TCB, then send a reset](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) and return.

## <SEQ=0><ACK=SEG.SEQ+SEG.LEN><CTL=RST,ACK>

- [Set RCV.NXT to SEG.SEQ+1, IRS is set to SEG.SEQ, and any other control or text should be](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) queued for processing later. ISS should be selected and a SYN segment sent of the form:

## <SEQ=ISS><ACK=RCV.NXT><CTL=SYN,ACK>

- [SND.NXT is set to ISS+1 and SND.UNA to ISS. The connection state should be changed to](https://www.rfc-editor.org/info/rfc5927) [SYN-RECEIVED. Note that any other incoming control or data (combined with SYN) will be](https://www.rfc-editor.org/info/rfc2883) [processed in the SYN-RECEIVED state, but processing of SYN and ACK should not be](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) repeated. If the listen was not fully specified (i.e., the remote socket was not fully specified), then the unspecified fields should be filled in now.

[Fourth, other data or control:](https://www.rfc-editor.org/info/rfc9170)

- This should not be reached. Drop the segment and return. Any other control or databearing segment (not containing SYN) must have an ACK and thus would have been [discarded by the ACK processing in the second step, unless it was first discarded by RST](https://www.rfc-editor.org/info/rfc1191) checking in the first step.

##### 3.10.7.3. [SYN-SENT STATE](https://www.rfc-editor.org/info/rfc2119)

If the state is SYN-SENT, then

First, check the ACK bit:

- If the ACK bit is set,

- [If SEG.ACK =< ISS or SEG.ACK > SND.NXT, send a reset (unless the RST bit is set, if so drop](https://www.rfc-editor.org/rfc/rfc6528#section-3) [the segment and return)](https://doi.org/10.1109/INFCOM.1999.752180)

## [<SEQ=SEG.ACK><CTL=RST>](https://www.rfc-editor.org/info/rfc7094)

- [and discard the segment. Return.](https://www.rfc-editor.org/info/rfc3168)

- [If SND.UNA < SEG.ACK =< SND.NXT, then the ACK is acceptable. Some deployed TCP code](https://www.rfc-editor.org/info/rfc7323) [has used the check SEG.ACK == SND.NXT (using "==" rather than "=<"), but this is not](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [appropriate when the stack is capable of sending data on the SYN because the TCP peer](https://www.rfc-editor.org/info/rfc1349) [may not accept and acknowledge all of the data on the SYN.](https://www.rfc-editor.org/info/rfc5044)

[Second, check the RST bit:](https://www.rfc-editor.org/info/rfc1644)

- If the RST bit is set,

- A potential blind reset attack is described in RFC 5961 [[9]](https://www.rfc-editor.org/errata/eid1569) [. The mitigation described in](https://www.rfc-editor.org/errata/eid1569) [that document has specific applicability explained therein, and is not a substitute for](https://www.rfc-editor.org/info/rfc2018) [cryptographic protection (e.g., IPsec or TCP-AO). A TCP implementation that supports the](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) mitigation described in RFC 5961 SHOULD [first check that the sequence number exactly](https://www.rfc-editor.org/errata/eid2296) matches RCV.NXT prior to executing the action in the next paragraph.

- If the ACK was acceptable, then signal to the user "error: connection reset", drop the [segment, enter CLOSED state, delete TCB, and return. Otherwise (no ACK), drop the](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [segment and return.](https://www.rfc-editor.org/errata/eid1562)

[Third, check the security:](https://trustee.ietf.org/license-info)

- [If the security/compartment in the segment does not exactly match the security/](https://www.rfc-editor.org/info/rfc2883) [compartment in the TCB, send a reset:](https://www.rfc-editor.org/rfc/rfc879)

- [If there is an ACK,](https://www.rfc-editor.org/rfc/rfc2525#section-2.17)

## [<SEQ=SEG.ACK><CTL=RST>](https://www.rfc-editor.org/info/rfc8201)

- Otherwise,

## <SEQ=0><ACK=SEG.SEQ+SEG.LEN><CTL=RST,ACK>

- [If a reset was sent, discard the segment and return.](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

Fourth, check the SYN bit:

- [This step should be reached only if the ACK is ok, or there is no ACK, and the segment did](https://www.rfc-editor.org/info/rfc793) not contain a RST.

- [◦](https://www.iana.org/assignments/tcp-parameters/) [If the SYN bit is on and the security/compartment is acceptable, then RCV.NXT is set to](https://www.rfc-editor.org/info/rfc2474) [SEG.SEQ+1, IRS is set to SEG.SEQ. SND.UNA should be advanced to equal SEG.ACK (if there](https://www.rfc-editor.org/info/rfc896) [is an ACK), and any segments on the retransmission queue that are thereby acknowledged](https://www.rfc-editor.org/rfc/rfc6528#section-3) should be removed.

- [If SND.UNA > ISS (our SYN has been ACKed), change the connection state to ESTABLISHED,](https://www.rfc-editor.org/info/rfc4987) [form an ACK segment](https://www.rfc-editor.org/errata/eid3301)

## [<SEQ=SND.NXT><ACK=RCV.NXT><CTL=ACK>](https://www.rfc-editor.org/info/rfc3168)

- [and send it. Data or controls that were queued for transmission](https://www.rfc-editor.org/info/rfc7323) [MAY](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [be included. Some](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [TCP implementations suppress sending this segment when the received segment contains](https://www.rfc-editor.org/info/rfc1349) [data that will anyways generate an acknowledgment in the later processing steps, saving](https://www.rfc-editor.org/info/rfc5044) this extra acknowledgment of the SYN from being sent. If there are other controls or text in the segment, then continue processing at the sixth step under Section 3.10.7.4 where the [URG bit is checked; otherwise, return.](https://www.iana.org/assignments/tcp-parameters/)

- Otherwise, enter SYN-RECEIVED, form a SYN,ACK segment

## [<SEQ=ISS><ACK=RCV.NXT><CTL=SYN,ACK>](https://www.rfc-editor.org/info/rfc5961)

- [and send it. Set the variables:](https://www.rfc-editor.org/info/rfc7657)

## [SND.WND <- SEG.WND](https://www.rfc-editor.org/errata/eid2296)

## [SND.WL1 <- SEG.SEQ](https://www.rfc-editor.org/info/rfc5795)

## [SND.WL2 <- SEG.ACK](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04)

If there are other controls or text in the segment, queue them for processing after the ESTABLISHED state has been reached, return.

- Note that it is legal to send and receive application data on SYN segments (this is the "text in the segment" mentioned above). There has been significant misinformation and [misunderstanding of this topic historically. Some firewalls and security devices consider](https://www.rfc-editor.org/info/rfc8303)

[this suspicious. However, the capability was used in T/TCP](https://trustee.ietf.org/license-info) [[21]](https://www.rfc-editor.org/info/rfc8200) [and is used in TCP Fast](https://www.rfc-editor.org/rfc/rfc1122#section-4.2.2.2) Open (TFO) [[48]](https://www.rfc-editor.org/info/rfc8200) [, so is important for implementations and network devices to permit.](https://www.rfc-editor.org/info/rfc2883)

[Fifth, if neither of the SYN or RST bits is set, then drop the segment and return.](https://www.rfc-editor.org/rfc/rfc6528)

##### 3.10.7.4. Other States

Otherwise,

[First, check sequence number:](https://www.rfc-editor.org/errata/eid2748)

- [SYN-RECEIVED STATE](https://www.rfc-editor.org/rfc/rfc7657#section-5.1)

- ESTABLISHED STATE

- FIN-WAIT-1 STATE

- FIN-WAIT-2 STATE

- CLOSE-WAIT STATE

- CLOSING STATE

- LAST-ACK STATE

- TIME-WAIT STATE

- [Segments are processed in sequence. Initial tests on arrival are used to discard old](https://www.rfc-editor.org/info/rfc7094) [duplicates, but further processing is done in SEG.SEQ order. If a segment's contents](https://www.rfc-editor.org/ien/ien177.txt) [straddle the boundary between old and new, only the new parts are processed.](https://www.rfc-editor.org/info/rfc3168)

- [In general, the processing of received segments](https://www.rfc-editor.org/info/rfc7323) [MUST](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [be implemented to aggregate ACK](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [segments whenever possible (MUST-58). For example, if the TCP endpoint is processing a](https://www.rfc-editor.org/info/rfc1349) [series of queued segments, it](https://www.rfc-editor.org/info/rfc5033) MUST [process them all before sending any ACK segments](https://www.rfc-editor.org/errata/eid573) (MUST-59).

- There are four cases for the acceptability test for an incoming segment:

### Segment [Receive](https://www.iana.org/assignments/tcp-parameters/) Test Length Window

## 0 [0](https://www.rfc-editor.org/info/rfc5961) [SEG.SEQ = RCV.NXT](https://www.rfc-editor.org/errata/eid1283)

## 0 >0 [RCV.NXT =< SEG.SEQ < RCV.NXT+RCV.WND](https://www.rfc-editor.org/errata/eid2296)

>0 [0](https://www.rfc-editor.org/info/rfc5795) [not acceptable](https://www.rfc-editor.org/info/rfc2525)

>0 [>0](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [RCV.NXT =< SEG.SEQ < RCV.NXT+RCV.WND](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [or](https://www.rfc-editor.org/info/rfc9293) [RCV.NXT =< SEG.SEQ+SEG.LEN-1 <](https://www.rfc-editor.org/errata/eid1564) [RCV.NXT+RCV.WND](https://www.rfc-editor.org/info/rfc8095)

### [Table 6: Segment Acceptability Tests](https://www.rfc-editor.org/rfc/rfc5961#section-5)

- [In implementing sequence number validation as described here, please note Appendix](https://www.rfc-editor.org/info/rfc8303) A.2.

- [If the RCV.WND is zero, no segments will be acceptable, but special allowance should be](https://www.rfc-editor.org/info/rfc5927) [made to accept valid ACKs, URGs, and RSTs.](https://www.rfc-editor.org/info/rfc2883)

- [If an incoming segment is not acceptable, an acknowledgment should be sent in reply](https://www.rfc-editor.org/rfc/rfc6691) (unless the RST bit is set, if so drop the segment and return):

## [<SEQ=SND.NXT><ACK=RCV.NXT><CTL=ACK>](https://www.rfc-editor.org/info/rfc8201)

- [▪](mailto:wes@mti-systems.com) [After sending the acknowledgment, drop the unacceptable segment and return.](https://www.rfc-editor.org/info/rfc791)

- Note that for the TIME-WAIT state, there is an improved algorithm described in [[40]](https://www.rfc-editor.org/info/rfc3449) for [handling incoming SYN segments that utilizes timestamps rather than relying on the](https://www.rfc-editor.org/info/rfc1191) [sequence number check described here. When the improved algorithm is implemented,](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) the logic above is not applicable for incoming SYN segments with Timestamp Options, received on a connection in the TIME-WAIT state.

- In the following it is assumed that the segment is the idealized segment that begins at [RCV.NXT and does not exceed the window. One could tailor actual segments to fit this](https://www.rfc-editor.org/info/rfc793) [assumption by trimming off any portions that lie outside the window (including SYN and](https://www.rfc-editor.org/info/rfc8558) [FIN) and only processing further if the segment then begins at RCV.NXT. Segments with](https://www.rfc-editor.org/info/rfc2474) higher beginning sequence numbers SHOULD [be held for later processing (SHLD-31).](https://www.rfc-editor.org/info/rfc4821)

[Second, check the RST bit:](https://doi.org/10.1109/INFCOM.1999.752180)

- [, Section 3 describes a potential blind reset attack and optional mitigation](https://www.rfc-editor.org/info/rfc4987) [approach. This does not provide a cryptographic protection (e.g., as in IPsec or TCP-AO) but](https://www.rfc-editor.org/ien/ien177.txt) [can be applicable in situations described in RFC 5961. For stacks implementing the](https://www.rfc-editor.org/info/rfc3168) [protection described in RFC 5961, the three checks below apply; otherwise, processing for](https://www.rfc-editor.org/info/rfc4953) [these states is indicated further below.](https://www.rfc-editor.org/info/rfc7323) 1) [If the RST bit is set and the sequence number is outside the current receive window,](https://www.rfc-editor.org/info/rfc1349) [silently drop the segment.](https://www.rfc-editor.org/info/rfc5033)

2) If the RST bit is set and the sequence number exactly matches the next expected sequence number (RCV.NXT), then TCP endpoints [MUST](https://www.rfc-editor.org/info/rfc5681) [reset the connection in the](https://www.rfc-editor.org/info/rfc5681) [manner prescribed below according to the connection state.](https://www.rfc-editor.org/info/rfc5461)

3) If the RST bit is set and the sequence number does not exactly match the next expected sequence value, yet is within the current receive window, TCP endpoints MUST [send an acknowledgment (challenge ACK):](https://www.rfc-editor.org/info/rfc2018)

## <SEQ=SND.NXT><ACK=RCV.NXT><CTL=ACK>

[After sending the challenge ACK, TCP endpoints](https://www.rfc-editor.org/info/rfc5795) [MUST](https://www.rfc-editor.org/info/rfc2525) [drop the unacceptable](https://www.rfc-editor.org/info/rfc2525) [segment and stop processing the incoming packet further. Note that RFC 5961 and](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [Errata ID 4772](https://www.rfc-editor.org/errata/eid1562) [99] [contain additional considerations for ACK throttling in an](https://www.rfc-editor.org/info/rfc6633) implementation.

- [SYN-RECEIVED STATE](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

- [If the RST bit is set,](https://www.rfc-editor.org/info/rfc8174)

- If this connection was initiated with a passive OPEN (i.e., came from the LISTEN state), [then return this connection to LISTEN state and return. The user need not be](https://www.rfc-editor.org/info/rfc8303)

[informed. If this connection was initiated with an active OPEN (i.e., came from SYN-](https://www.rfc-editor.org/info/rfc5927) [SENT state), then the connection was refused; signal the user "connection refused". In](https://www.rfc-editor.org/info/rfc2883) [either case, the retransmission queue should be flushed. And in the active OPEN case,](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) enter the CLOSED state and delete the TCB, and return.

- ESTABLISHED STATE

- [FIN-WAIT-1 STATE](mailto:wes@mti-systems.com)

- FIN-WAIT-2 STATE

- CLOSE-WAIT STATE

- If the RST bit is set, then any outstanding RECEIVEs and SEND should receive "reset" [responses. All segment queues should be flushed. Users should also receive an](https://www.rfc-editor.org/info/rfc6691) [unsolicited general "connection reset" signal. Enter the CLOSED state, delete the TCB, and](https://www.rfc-editor.org/info/rfc8548) [return.](https://www.rfc-editor.org/rfc/rfc5570#section-7.3.1)

- [◦](https://www.iana.org/assignments/tcp-parameters/) [CLOSING STATE](https://www.iana.org/assignments/tcp-parameters/)

- LAST-ACK STATE

- TIME-WAIT STATE

- [If the RST bit is set, then enter the CLOSED state, delete the TCB, and return.](https://www.rfc-editor.org/info/rfc1011)

Third, check security:

- [SYN-RECEIVED STATE](https://www.rfc-editor.org/info/rfc1122)

- [If the security/compartment in the segment does not exactly match the security/](https://www.rfc-editor.org/info/rfc7323) [compartment in the TCB, then send a reset and return.](https://www.rfc-editor.org/rfc/rfc5681#section-4.2)

- ESTABLISHED STATE

- FIN-WAIT-1 STATE

- FIN-WAIT-2 STATE

- CLOSE-WAIT STATE

- CLOSING STATE

- LAST-ACK STATE

- TIME-WAIT STATE

- [If the security/compartment in the segment does not exactly match the security/](https://www.rfc-editor.org/info/rfc5795) [compartment in the TCB, then send a reset; any outstanding RECEIVEs and SEND should](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [receive "reset" responses. All segment queues should be flushed. Users should also](https://www.rfc-editor.org/info/rfc6633) [receive an unsolicited general "connection reset" signal. Enter the CLOSED state, delete](https://www.rfc-editor.org/info/rfc9293) [the TCB, and return.](https://www.rfc-editor.org/errata/eid3602)

- Note this check is placed following the sequence check to prevent a segment from an old connection between these port numbers with a different security from causing an abort of [the current connection.](https://www.rfc-editor.org/errata/eid1571)

[Fourth, check the SYN bit:](https://trustee.ietf.org/license-info)

- [SYN-RECEIVED STATE](https://www.rfc-editor.org/info/rfc8200)

- [▪](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [If the connection was initiated with a passive OPEN, then return this connection to the](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [LISTEN state and return. Otherwise, handle per the directions for synchronized states](https://www.rfc-editor.org/info/rfc2923) below.

- [ESTABLISHED STATE](mailto:wes@mti-systems.com)

- FIN-WAIT-1 STATE

- FIN-WAIT-2 STATE

- CLOSE-WAIT STATE

- CLOSING STATE

- LAST-ACK STATE

- [◦](https://www.iana.org/assignments/tcp-parameters/) [TIME-WAIT STATE](https://www.iana.org/assignments/tcp-parameters/)

- [If the SYN bit is set in these synchronized states, it may be either a legitimate new](https://www.rfc-editor.org/info/rfc2474) connection attempt (e.g., in the case of TIME-WAIT), an error where the connection [should be reset, or the result of an attack attempt, as described in RFC 5961](https://www.rfc-editor.org/info/rfc2914) [9] . For the [TIME-WAIT state, new connections can be accepted if the Timestamp Option is used and](https://www.rfc-editor.org/info/rfc1011) [meets expectations (per](https://www.rfc-editor.org/info/rfc7094) [[40]](https://www.rfc-editor.org/info/rfc7094) [). For all other cases, RFC 5961 provides a mitigation with](https://www.rfc-editor.org/info/rfc4987) [applicability to some situations, though there are also alternatives that offer](https://www.rfc-editor.org/ien/ien177.txt) [cryptographic protection (see Section 7). RFC 5961 recommends that in these](https://www.rfc-editor.org/info/rfc3168) [synchronized states, if the SYN bit is set, irrespective of the sequence number, TCP](https://www.rfc-editor.org/info/rfc7323) endpoints [MUST](https://www.rfc-editor.org/rfc/rfc5461#section-4) [send a "challenge ACK" to the remote peer:](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html)

## <SEQ=SND.NXT><ACK=RCV.NXT><CTL=ACK>

- [After sending the acknowledgment, TCP implementations](https://www.rfc-editor.org/info/rfc9065) [MUST](https://www.rfc-editor.org/errata/eid574) [drop the unacceptable](https://www.rfc-editor.org/errata/eid574) segment and stop processing further. Note that RFC 5961 and Errata ID 4772 [[99]](https://www.rfc-editor.org/info/rfc5681) [contain](https://www.rfc-editor.org/info/rfc1644) [additional ACK throttling notes for an implementation.](https://www.rfc-editor.org/info/rfc5461)

- For implementations that do not follow RFC 5961, the original behavior described in RFC 793 follows in this paragraph. If the SYN is in the window it is an error: send a reset, any [outstanding RECEIVEs and SEND should receive "reset" responses, all segment queues](https://www.rfc-editor.org/info/rfc2018) should be flushed, the user should also receive an unsolicited general "connection reset" signal, enter the CLOSED state, delete the TCB, and return.

- [If the SYN is not in the window, this step would not be reached and an ACK would have](https://www.rfc-editor.org/info/rfc2525) [been sent in the first step (sequence number check).](https://www.rfc-editor.org/info/rfc8087)

[Fifth, check the ACK field:](https://www.rfc-editor.org/errata/eid1562)

- if the ACK bit is off, drop the segment and return

- if the ACK bit is on,

- [[9], Section 5](https://www.rfc-editor.org/info/rfc6093) [describes a potential blind data injection attack, and mitigation](https://www.rfc-editor.org/errata/eid1571) [that implementations](https://www.rfc-editor.org/errata/eid1571) MAY choose to include (MAY-12). TCP stacks that implement RFC 5961 MUST [add an input check that the ACK value is acceptable only if it is in the range](https://www.rfc-editor.org/info/rfc8303)

[of ((SND.UNA - MAX.SND.WND) =< SEG.ACK =< SND.NXT). All incoming segments whose](https://www.rfc-editor.org/info/rfc5927) [ACK value doesn't satisfy the above condition](https://www.rfc-editor.org/info/rfc2883) [MUST](https://www.rfc-editor.org/info/rfc2883) be discarded and an ACK sent back. [The new state variable MAX.SND.WND is defined as the largest window that the local](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) sender has ever received from its peer (subject to window scaling) or may be hard-coded [to a maximum permissible window value. When the ACK value is acceptable, the per-](https://www.rfc-editor.org/info/rfc2923) [state processing below applies:](https://www.rfc-editor.org/info/rfc8201)

- [▪](mailto:wes@mti-systems.com) [SYN-RECEIVED STATE](https://www.rfc-editor.org/info/rfc9170)

- If SND.UNA < SEG.ACK =< SND.NXT, then enter ESTABLISHED state and continue processing with the variables below set to:

## SND.WND <- SEG.WND

## [SND.WL1 <- SEG.SEQ](https://www.rfc-editor.org/info/rfc3465)

## [SND.WL2 <- SEG.ACK](https://www.rfc-editor.org/errata/eid2934)

- [If the segment acknowledgment is not acceptable, form a reset segment](https://www.rfc-editor.org/info/rfc8558)

## <SEQ=SEG.ACK><CTL=RST>

- and send it.

- [ESTABLISHED STATE](https://www.rfc-editor.org/info/rfc7094)

- If SND.UNA < SEG.ACK =< SND.NXT, then set SND.UNA <- SEG.ACK. Any segments on the [retransmission queue that are thereby entirely acknowledged are removed. Users](https://www.rfc-editor.org/info/rfc3168) [should receive positive acknowledgments for buffers that have been SENT and fully](https://www.rfc-editor.org/info/rfc4953) [acknowledged (i.e., SEND buffer should be returned with "ok" response). If the ACK is a](https://www.rfc-editor.org/info/rfc7323) [duplicate (SEG.ACK =< SND.UNA), it can be ignored. If the ACK acks something not yet](https://www.rfc-editor.org/info/rfc1349) [sent (SEG.ACK > SND.NXT), then send an ACK, drop the segment, and return.](https://www.rfc-editor.org/info/rfc5044)

- If SND.UNA =< SEG.ACK =< SND.NXT, the send window should be updated. If (SND.WL1 [< SEG.SEQ or (SND.WL1 = SEG.SEQ and SND.WL2 =< SEG.ACK)), set SND.WND <-](https://www.rfc-editor.org/info/rfc5461) [SEG.WND, set SND.WL1 <- SEG.SEQ, and set SND.WL2 <- SEG.ACK.](https://www.iana.org/assignments/tcp-parameters/)

- Note that SND.WND is an offset from SND.UNA, that SND.WL1 records the sequence [number of the last segment used to update SND.WND, and that SND.WL2 records the](https://www.rfc-editor.org/info/rfc2018) [acknowledgment number of the last segment used to update SND.WND. The check](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) [here prevents using old segments to update the window.](https://www.rfc-editor.org/info/rfc7657)

- [FIN-WAIT-1 STATE](https://www.rfc-editor.org/info/rfc6298)

- In addition to the processing for the ESTABLISHED state, if the FIN segment is now [acknowledged, then enter FIN-WAIT-2 and continue processing in that state.](https://www.rfc-editor.org/info/rfc6633)

- [▪](https://www.rfc-editor.org/rfc/rfc8095#section-3.1) [FIN-WAIT-2 STATE](https://www.rfc-editor.org/errata/eid3602)

- [In addition to the processing for the ESTABLISHED state, if the retransmission queue is](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) empty, the user's CLOSE can be acknowledged ("ok") but do not delete the TCB.

- [CLOSE-WAIT STATE](https://www.rfc-editor.org/errata/eid1571)

- Do the same processing as for the ESTABLISHED state.

- [CLOSING STATE](https://trustee.ietf.org/license-info)

- [In addition to the processing for the ESTABLISHED state, if the ACK acknowledges our](https://www.rfc-editor.org/info/rfc2883) [FIN, then enter the TIME-WAIT state; otherwise, ignore the segment.](https://www.rfc-editor.org/rfc/rfc6528)

- LAST-ACK STATE

- The only thing that can arrive in this state is an acknowledgment of our FIN. If our FIN [is now acknowledged, delete the TCB, enter the CLOSED state, and return.](https://www.rfc-editor.org/info/rfc791)

- [TIME-WAIT STATE](https://www.rfc-editor.org/info/rfc8961)

- [The only thing that can arrive in this state is a retransmission of the remote FIN.](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) Acknowledge it, and restart the 2 MSL timeout.

Sixth, check the URG bit:

- ESTABLISHED STATE

- [◦](https://www.iana.org/assignments/tcp-parameters/) [FIN-WAIT-1 STATE](https://www.iana.org/assignments/tcp-parameters/)

- FIN-WAIT-2 STATE

- [If the URG bit is set, RCV.UP <- max(RCV.UP,SEG.UP), and signal the user that the remote](https://www.rfc-editor.org/info/rfc2914) [side has urgent data if the urgent pointer (RCV.UP) is in advance of the data consumed. If](https://www.rfc-editor.org/info/rfc1011) [the user has already been signaled (or is still in the "urgent mode") for this continuous](https://www.rfc-editor.org/info/rfc4987) [sequence of urgent data, do not signal the user again.](https://www.rfc-editor.org/ien/ien177.txt)

- CLOSE-WAIT STATE

- CLOSING STATE

- LAST-ACK STATE

- TIME-WAIT STATE

- [This should not occur since a FIN has been received from the remote side. Ignore the](https://www.rfc-editor.org/info/rfc5461) URG.

Seventh, process the segment text:

- ESTABLISHED STATE

- FIN-WAIT-1 STATE

- FIN-WAIT-2 STATE

- Once in the ESTABLISHED state, it is possible to deliver segment data to user RECEIVE [buffers. Data from segments can be moved into buffers until either the buffer is full or](https://www.rfc-editor.org/info/rfc6633) [the segment is empty. If the segment empties and carries a PUSH flag, then the user is](https://www.rfc-editor.org/info/rfc9293) [informed, when the buffer is returned, that a PUSH has been received.](https://www.rfc-editor.org/rfc/rfc793#section-2)

- [When the TCP endpoint takes responsibility for delivering the data to the user, it must](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [also acknowledge the receipt of the data.](https://www.rfc-editor.org/rfc/rfc5961#section-5)

- [Once the TCP endpoint takes responsibility for the data, it advances RCV.NXT over the](https://www.rfc-editor.org/info/rfc5927) [data accepted, and adjusts RCV.WND as appropriate to the current buffer availability.](https://www.rfc-editor.org/info/rfc2883) [The total of RCV.NXT and RCV.WND should not be reduced.](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10)

- [▪](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [A TCP implementation](https://www.rfc-editor.org/rfc/rfc1011) MAY send an ACK segment acknowledging RCV.NXT when a valid [segment arrives that is in the window but not at the left window edge (MAY-13).](https://www.rfc-editor.org/info/rfc2923)

- [▪](mailto:wes@mti-systems.com) [Please note the window management suggestions in Section 3.8.](https://www.rfc-editor.org/info/rfc791)

- Send an acknowledgment of the form:

## <SEQ=SND.NXT><ACK=RCV.NXT><CTL=ACK>

- [This acknowledgment should be piggybacked on a segment being transmitted if possible](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [without incurring undue delay.](https://www.rfc-editor.org/info/rfc3465)

- CLOSE-WAIT STATE

- CLOSING STATE

- [◦](https://www.iana.org/assignments/tcp-parameters/) [LAST-ACK STATE](https://www.iana.org/assignments/tcp-parameters/)

- TIME-WAIT STATE

- [This should not occur since a FIN has been received from the remote side. Ignore the](https://www.rfc-editor.org/rfc/rfc6528#section-3) segment text.

Eighth, check the FIN bit:

- [Do not process the FIN if the state is CLOSED, LISTEN, or SYN-SENT since the SEG.SEQ](https://www.rfc-editor.org/info/rfc3168) [cannot be validated; drop the segment and return.](https://www.rfc-editor.org/info/rfc7323)

- [If the FIN bit is set, signal the user "connection closing" and return any pending RECEIVEs](https://www.rfc-editor.org/info/rfc1349) with same message, advance RCV.NXT over the FIN, and send an acknowledgment for the [FIN. Note that FIN implies PUSH for any segment text not yet delivered to the user.](https://www.rfc-editor.org/info/rfc5044)

- SYN-RECEIVED STATE

- [ESTABLISHED STATE](https://www.iana.org/assignments/tcp-parameters/)

- Enter the CLOSE-WAIT state.

- [FIN-WAIT-1 STATE](https://www.rfc-editor.org/info/rfc5570)

- If our FIN has been ACKed (perhaps in this segment), then enter TIME-WAIT, start the time-wait timer, turn off the other timers; otherwise, enter the CLOSING state.

- [FIN-WAIT-2 STATE](https://www.rfc-editor.org/info/rfc8087)

- [Enter the TIME-WAIT state. Start the time-wait timer, turn off the other timers.](https://www.rfc-editor.org/info/rfc6633)

- [CLOSE-WAIT STATE](https://www.rfc-editor.org/errata/eid3602)

- [Remain in the CLOSE-WAIT state.](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

- CLOSING STATE

- Remain in the CLOSING state.

- [LAST-ACK STATE](https://trustee.ietf.org/license-info)

- [Remain in the LAST-ACK state.](https://www.rfc-editor.org/info/rfc8311)

- [▪](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [TIME-WAIT STATE](https://www.rfc-editor.org/rfc/rfc2525#section-2.17)

- [Remain in the TIME-WAIT state. Restart the 2 MSL time-wait timeout.](https://www.rfc-editor.org/info/rfc6429)

[and return.](mailto:wes@mti-systems.com)

#### 3.10.8. Timeouts

## USER TIMEOUT

- [For any state if the user timeout expires, flush all queues, signal the user "error: connection](https://www.rfc-editor.org/info/rfc6691) [aborted due to user timeout" in general and for any outstanding calls, delete the TCB, enter](https://www.rfc-editor.org/info/rfc8548) [the CLOSED state, and return.](https://www.rfc-editor.org/errata/eid2934)

## [RETRANSMISSION TIMEOUT](https://www.iana.org/assignments/tcp-parameters/)

- [For any state if the retransmission timeout expires on a segment in the retransmission](https://www.rfc-editor.org/info/rfc6994) [queue, send the segment at the front of the retransmission queue again, reinitialize the](https://www.rfc-editor.org/rfc/rfc6528#section-3) [retransmission timer, and return.](https://doi.org/10.1109/INFCOM.1999.752180)

## TIME-WAIT TIMEOUT

- [If the time-wait timeout expires on a connection, delete the TCB, enter the CLOSED state, and](https://www.rfc-editor.org/info/rfc3168) return.

## 4. Glossary

ACK [A control bit (acknowledge) occupying no sequence space, which indicates that the](https://www.rfc-editor.org/info/rfc5461) acknowledgment field of this segment specifies the next sequence number the sender of this segment is expecting to receive, hence acknowledging receipt of all previous [sequence numbers.](https://www.rfc-editor.org/info/rfc5961)

connection A logical communication path identified by a pair of sockets.

datagram [A message sent in a packet-switched computer communications network.](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4)

[Destination Address](https://www.rfc-editor.org/rfc/rfc8095#section-3.1) [The network-layer address of the endpoint intended to receive a segment.](https://www.rfc-editor.org/rfc/rfc793#section-2)

FIN A control bit (finis) occupying one sequence number, which indicates that the sender will send no more data or control occupying sequence space.

flush [To remove all of the contents (data or segments) from a store (buffer or queue).](https://www.rfc-editor.org/info/rfc2883)

[fragment](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [A portion of a logical unit of data. In particular, an internet fragment is a portion of an](https://www.rfc-editor.org/info/rfc2923) [internet datagram.](https://www.rfc-editor.org/info/rfc8201)

header Control information at the beginning of a message, segment, fragment, packet, or block of data.

host [A computer. In particular, a source or destination of messages from the point of view of](https://www.rfc-editor.org/info/rfc6691) [the communication network.](https://www.rfc-editor.org/info/rfc2119)

Identification [An Internet Protocol field. This identifying value assigned by the sender aids in](https://www.rfc-editor.org/info/rfc8558) assembling the fragments of a datagram.

internet address A network-layer address.

internet datagram A unit of data exchanged between internet hosts, together with the internet header that [allows the datagram to be routed from source to destination.](https://www.rfc-editor.org/info/rfc3168)

internet fragment [A portion of the data of an internet datagram with an internet header.](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html)

IP [Internet Protocol. See](https://www.rfc-editor.org/info/rfc9065) [[1]](https://www.rfc-editor.org/info/rfc9065) [and](https://www.rfc-editor.org/info/rfc9065) [13] .

IRS The Initial Receive Sequence number. The first sequence number used by the sender on a connection.

ISN [The Initial Sequence Number. The first sequence number used on a connection (either](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) ISS or IRS). Selected in a way that is unique within a given period of time and is [unpredictable to attackers.](https://www.rfc-editor.org/info/rfc6298)

ISS [The Initial Send Sequence number. The first sequence number used by the sender on a](https://www.rfc-editor.org/info/rfc6633) connection.

left sequence [This is the next sequence number to be acknowledged by the data-receiving TCP](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) endpoint (or the lowest currently unacknowledged sequence number) and is sometimes referred to as the left edge of the send window.

module [An implementation, usually in software, of a protocol or other procedure.](https://www.rfc-editor.org/info/rfc2883)

[MSL](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [Maximum Segment Lifetime, the time a TCP segment can exist in the internetwork](https://www.rfc-editor.org/info/rfc2923) [system. Arbitrarily defined to be 2 minutes.](https://www.rfc-editor.org/info/rfc8201)

octet An eight-bit byte.

Options [An Option field may contain several options, and each option may be several octets in](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) length.

packet [A package of data with a header that may or may not be logically complete. More often a](https://www.rfc-editor.org/info/rfc793) [physical packaging than a logical packaging of data.](https://www.rfc-editor.org/info/rfc4727)

port The portion of a connection identifier used for demultiplexing connections at an endpoint.

process A program in execution. A source or destination of data from the point of view of the [TCP endpoint or other host-to-host protocol.](https://www.rfc-editor.org/info/rfc3168)

PUSH [A control bit occupying no sequence space, indicating that this segment contains data](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) that must be pushed through to the receiving user.

RCV.NXT [receive next sequence number](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.4.2)

RCV.UP receive urgent pointer

RCV.WND receive window

receive next sequence number [This is the next sequence number the local TCP endpoint is expecting to receive.](https://www.rfc-editor.org/info/rfc5795)

receive window [This represents the sequence numbers the local (receiving) TCP endpoint is willing to](https://www.rfc-editor.org/info/rfc9293) receive. Thus, the local TCP endpoint considers that segments overlapping the range [RCV.NXT to RCV.NXT + RCV.WND - 1 carry acceptable data or control. Segments](https://www.rfc-editor.org/rfc/rfc793#section-2) [containing sequence numbers entirely outside this range are considered duplicates or](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [injection attacks and discarded.](https://www.rfc-editor.org/rfc/rfc5961#section-5)

RST [A control bit (reset), occupying no sequence space, indicating that the receiver should](https://www.rfc-editor.org/info/rfc2883) [delete the connection without further interaction. The receiver can determine, based on](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) the sequence number and acknowledgment fields of the incoming segment, whether it [should honor the reset command or ignore it. In no case does receipt of a segment](https://www.rfc-editor.org/info/rfc2923) [containing RST give rise to a RST in response.](https://www.rfc-editor.org/info/rfc8201)

SEG.ACK segment acknowledgment

SEG.LEN segment length

SEG.SEQ segment sequence

SEG.UP segment urgent pointer field

SEG.WND segment window field

segment A logical unit of data. In particular, a TCP segment is the unit of data transferred [between a pair of TCP modules.](https://www.rfc-editor.org/info/rfc3168)

segment acknowledgment [The sequence number in the acknowledgment field of the arriving segment.](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html)

segment length The amount of sequence number space occupied by a segment, including any controls that occupy sequence space.

segment sequence The number in the sequence field of the arriving segment.

send sequence [This is the next sequence number the local (sending) TCP endpoint will use on the](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) connection. It is initially selected from an initial sequence number curve (ISN) and is incremented for each octet of data or sequenced control transmitted.

send window [This represents the sequence numbers that the remote (receiving) TCP endpoint is](https://www.rfc-editor.org/info/rfc6633) [willing to receive. It is the value of the window field specified in segments from the](https://www.rfc-editor.org/info/rfc9293) remote (data-receiving) TCP endpoint. The range of new sequence numbers that may be [emitted by a TCP implementation lies between SND.NXT and SND.UNA + SND.WND - 1.](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) (Retransmissions of sequence numbers between SND.UNA and SND.NXT are expected, of course.)

SND.NXT send sequence

[SND.UNA](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [left sequence](https://www.rfc-editor.org/rfc/rfc2525#section-2.17)

SND.UP [send urgent pointer](https://www.rfc-editor.org/info/rfc9170)

SND.WL1 segment sequence number at last window update

SND.WL2 segment acknowledgment number at last window update

SND.WND send window

socket (or socket number, or socket address, or socket identifier) [An address that specifically includes a port identifier, that is, the concatenation of an](https://www.rfc-editor.org/info/rfc896) Internet Address with a TCP port.

Source Address [The network-layer address of the sending endpoint.](https://www.rfc-editor.org/info/rfc7094)

SYN [A control bit in the incoming segment, occupying one sequence number, used at the](https://www.rfc-editor.org/info/rfc4953) [initiation of a connection to indicate where the sequence numbering will start.](https://www.rfc-editor.org/info/rfc7323)

TCB [Transmission control block, the data structure that records the state of a connection.](https://www.rfc-editor.org/info/rfc5044)

[Transmission Control Protocol: a host-to-host protocol for reliable communication in](https://www.rfc-editor.org/info/rfc5461) [internetwork environments.](https://www.rfc-editor.org/errata/eid1565)

TOS [Type of Service, an obsoleted IPv4 field. The same header bits currently are used for the](https://www.rfc-editor.org/info/rfc2018) [Differentiated Services field](https://www.rfc-editor.org/info/rfc7657) [[4]](https://www.rfc-editor.org/info/rfc7657) [containing the Differentiated Services Codepoint (DSCP)](https://www.rfc-editor.org/errata/eid2296) value and the 2-bit ECN codepoint [6] .

Type of Service See "TOS".

URG A control bit (urgent), occupying no sequence space, used to indicate that the receiving [user should be notified to do urgent processing as long as there is data to be consumed](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [with sequence numbers less than the value indicated by the urgent pointer.](https://www.rfc-editor.org/info/rfc2873)

urgent pointer [A control field meaningful only when the URG bit is on. This field communicates the](https://www.rfc-editor.org/info/rfc2883) [value of the urgent pointer that indicates the data octet associated with the sending](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [user's urgent call.](https://www.rfc-editor.org/rfc/rfc2525#section-2.17)

## 5. [Changes from RFC 793](https://www.rfc-editor.org/info/rfc9170)

This document obsoletes RFC 793 as well as RFCs 6093 and 6528, which updated 793. In all cases, [only the normative protocol specification and requirements have been incorporated into this](https://www.rfc-editor.org/info/rfc1191) [document, and some informational text with background and rationale may not have been](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) carried in. The informational content of those documents is still valuable in learning about and understanding TCP, and they are valid Informational references, even though their normative content has been incorporated into this document.

[The main body of this document was adapted from RFC 793's Section 3, titled "FUNCTIONAL](https://www.rfc-editor.org/info/rfc793) [SPECIFICATION", with an attempt to keep formatting and layout as close as possible.](https://www.rfc-editor.org/info/rfc8558)

[The collection of applicable RFC errata that have been reported and either accepted or held for](https://www.rfc-editor.org/info/rfc6994) an update to RFC 793 were incorporated (Errata IDs: 573 [[73]](https://www.rfc-editor.org/info/rfc4821) [, 574](https://www.rfc-editor.org/info/rfc4821) [[74]](https://www.rfc-editor.org/info/rfc4821) [, 700](https://www.rfc-editor.org/info/rfc4821) [[75]](https://www.rfc-editor.org/info/rfc4821) [, 701](https://www.rfc-editor.org/info/rfc4821) [[76]](https://www.rfc-editor.org/info/rfc4821) [, 1283](https://www.rfc-editor.org/info/rfc4821) [77] , 1561 [78] [, 1562](https://doi.org/10.1109/INFCOM.1999.752180) [[79]](https://doi.org/10.1109/INFCOM.1999.752180) [, 1564](https://doi.org/10.1109/INFCOM.1999.752180) [80] , 1571 [[81]](https://www.rfc-editor.org/info/rfc1011) [, 1572](https://www.rfc-editor.org/info/rfc2914) [[82]](https://www.rfc-editor.org/info/rfc2914) [, 2297](https://www.rfc-editor.org/info/rfc2914) [[83]](https://www.rfc-editor.org/info/rfc2914) [, 2298](https://www.rfc-editor.org/info/rfc2914) [[84]](https://www.rfc-editor.org/info/rfc2914) [, 2748](https://www.rfc-editor.org/info/rfc2914) [[85]](https://www.rfc-editor.org/info/rfc2914) , 2749 [86] , 2934 [87] , 3213 [88] [, 3300](https://www.rfc-editor.org/info/rfc7094) [[89]](https://www.rfc-editor.org/info/rfc7094) [, 3301](https://www.rfc-editor.org/info/rfc7094) [[90]](https://www.rfc-editor.org/info/rfc7094) [, 6222](https://www.rfc-editor.org/info/rfc7094) [[91]](https://www.rfc-editor.org/info/rfc7094) [). Some errata were not applicable due to other](https://www.rfc-editor.org/info/rfc4987) changes (Errata IDs: 572 [92] , 575 [93] , 1565 [94] , 1569 [95] , 2296 [96] , 3305 [97] , 3602 [[98]](https://www.rfc-editor.org/info/rfc9000) ).

[Changes to the specification of the urgent pointer described in RFCs 1011, 1122, and 6093 were](https://www.rfc-editor.org/info/rfc3168) [incorporated. See RFC 6093 for detailed discussion of why these changes were necessary.](https://www.rfc-editor.org/info/rfc7323)

[The discussion of the RTO from RFC 793 was updated to refer to RFC 6298. The text on the RTO in](https://www.rfc-editor.org/info/rfc1349) [RFC 1122 originally replaced the text in RFC 793; however, RFC 2988 should have updated RFC](https://www.rfc-editor.org/info/rfc5044) [1122 and has subsequently been obsoleted by RFC 6298.](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.4.2)

- [contains a number of comments about RFC 793, including some needed changes to](https://www.rfc-editor.org/info/rfc5461) the TCP specification. These are expanded in RFC 1122, which contains a collection of other changes and clarifications to RFC 793. The normative items impacting the protocol have been [incorporated here, though some historically useful implementation advice and informative](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [discussion from RFC 1122 is not included here. The present document, which is now the TCP](https://www.rfc-editor.org/info/rfc7657) specification rather than RFC 793, updates RFC 1011, and the comments noted in RFC 1011 have been incorporated.

[RFC 1122 contains more than just TCP requirements, so this document can't obsolete RFC 1122](https://www.rfc-editor.org/info/rfc8087) [entirely. It is only marked as "updating" RFC 1122; however, it should be understood to](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4) [effectively obsolete all of the material on TCP found in RFC 1122.](https://www.rfc-editor.org/info/rfc9293)

[The more secure initial sequence number generation algorithm from RFC 6528 was incorporated.](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [See RFC 6528 for discussion of the attacks that this mitigates, as well as advice on selecting PRF](https://www.rfc-editor.org/info/rfc2873) [algorithms and managing secret key data.](https://www.rfc-editor.org/info/rfc6093)

[A note based on RFC 6429 was added to explicitly clarify that system resource management](https://trustee.ietf.org/license-info) [concerns allow connection resources to be reclaimed. RFC 6429 is obsoleted in the sense that the](https://www.rfc-editor.org/info/rfc2883) [clarification it describes has been reflected within this base TCP specification.](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10)

[The description of congestion control implementation was added based on the set of documents](https://www.rfc-editor.org/info/rfc2923) [that are IETF BCP or Standards Track on the topic and the current state of common](https://www.rfc-editor.org/info/rfc6429) [implementations.](mailto:wes@mti-systems.com)

## 6. [IANA Considerations](https://www.rfc-editor.org/info/rfc8961)

[In the "Transmission Control Protocol (TCP) Header Flags" registry, IANA has made several](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [changes as described in this section.](https://www.rfc-editor.org/info/rfc3465)

RFC 3168 originally created this registry but only populated it with the new bits defined in RFC [3168, neglecting the other bits that had previously been described in RFC 793 and other](https://www.rfc-editor.org/info/rfc6864) [documents. Bit 7 has since also been updated by RFC 8311](https://www.rfc-editor.org/info/rfc4727) [[54]](https://www.rfc-editor.org/info/rfc8558) [.](https://www.rfc-editor.org/info/rfc8558)

[The "Bit" column has been renamed below as the "Bit Offset" column because it references each](https://www.rfc-editor.org/info/rfc896) [header flag's offset within the 16-bit aligned view of the TCP header in Figure 1. The bits in offsets](https://www.rfc-editor.org/rfc/rfc6528#section-3) 0 through 3 are the TCP segment Data Offset field, and not header flags.

[IANA has added a column for "Assignment Notes".](https://www.rfc-editor.org/info/rfc7094)

[IANA has assigned values as indicated below.](https://www.rfc-editor.org/info/rfc3168)

### Bit [Name](https://www.rfc-editor.org/rfc/rfc5461#section-4) [Reference](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [Assignment Notes](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) Offset

## 4 [Reserved for future use](https://www.rfc-editor.org/info/rfc9065)

## 5 [Reserved for future use](https://www.iana.org/assignments/tcp-parameters/)

## 6 Reserved for future use

7 [Reserved for future use](https://www.rfc-editor.org/info/rfc5961) [Previously used by Historic RFC](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) [3540 as NS (Nonce Sum).](https://www.rfc-editor.org/errata/eid2296)

## 8 [CWR (Congestion Window](https://www.rfc-editor.org/info/rfc6298) [Reduced)](https://www.rfc-editor.org/info/rfc5795)

## 9 [ECE (ECN-Echo)](https://www.rfc-editor.org/errata/eid1562)

## 10 [Urgent pointer field is](https://www.rfc-editor.org/errata/eid3602) [significant (URG)](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

## 11 [Acknowledgment field is](https://www.rfc-editor.org/info/rfc6093) [significant (ACK)](https://www.rfc-editor.org/errata/eid1571)

### Bit [Name](https://trustee.ietf.org/license-info) [Reference](https://www.rfc-editor.org/info/rfc5927) [Assignment Notes](https://www.rfc-editor.org/info/rfc8200) Offset

## [12](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [Push function (PSH)](https://www.rfc-editor.org/errata/eid2297)

## 13 [Reset the connection (RST)](https://www.rfc-editor.org/info/rfc8201)

## 14 Synchronize sequence [numbers (SYN)](https://www.rfc-editor.org/errata/eid2748)

## 15 [No more data from sender](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) (FIN)

### Table 7: TCP Header Flags

[The "TCP Header Flags" registry has also been moved to a subregistry under the global](https://doi.org/10.1016/0376-5075(78)90053-3) ["Transmission Control Protocol (TCP) Parameters" registry](https://www.rfc-editor.org/info/rfc4727) [<[https://www.iana.org/assignments/](https://www.iana.org/assignments/)](https://www.rfc-editor.org/info/rfc8558) tcp-parameters/> [.](https://www.rfc-editor.org/errata/eid3213)

The registry's Registration Procedure remains Standards Action, but the Reference has been updated to this document, and the Note has been removed.

## 7. [Security and Privacy Considerations](https://www.rfc-editor.org/ien/ien177.txt)

[The TCP design includes only rudimentary security features that improve the robustness and](https://www.rfc-editor.org/info/rfc4953) [reliability of connections and application data transfer, but there are no built-in cryptographic](https://www.rfc-editor.org/info/rfc7323) capabilities to support any form of confidentiality, authentication, or other typical security [functions. Non-cryptographic enhancements (e.g.,](https://www.rfc-editor.org/info/rfc5033) [[9]](https://www.rfc-editor.org/info/rfc5044) [) have been developed to improve](https://www.rfc-editor.org/info/rfc7413) robustness of TCP connections to particular types of attacks, but the applicability and protections [of non-cryptographic enhancements are limited (e.g., see](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.4.2) [Section 1.1 of [9]](https://www.rfc-editor.org/info/rfc5681) [). Applications typically](https://www.rfc-editor.org/info/rfc5681) [utilize lower-layer (e.g., IPsec) and upper-layer (e.g., TLS) protocols to provide security and](https://www.rfc-editor.org/info/rfc5461) privacy for TCP connections and application data carried in TCP. Methods based on TCP Options have been developed as well, to support some security capabilities.

[In order to fully provide confidentiality, integrity protection, and authentication for TCP](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [connections (including their control flags), IPsec is the only current effective method. For](https://www.rfc-editor.org/info/rfc7657) integrity protection and authentication, the TCP Authentication Option (TCP-AO) [[38]](https://www.rfc-editor.org/info/rfc6298) [is available,](https://www.rfc-editor.org/info/rfc6298) [with a proposed extension to also provide confidentiality for the segment payload. Other](https://www.rfc-editor.org/info/rfc5795) [methods discussed in this section may provide confidentiality or integrity protection for the](https://www.rfc-editor.org/info/rfc8087) [payload, but for the TCP header only cover either a subset of the fields (e.g., tcpcrypt](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4) [[57]](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [) or](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [none at all (e.g., TLS). Other security features that have been added to TCP (e.g., ISN generation,](https://www.rfc-editor.org/info/rfc9293) sequence number checks, and others) are only capable of partially hindering attacks.

[Applications using long-lived TCP flows have been vulnerable to attacks that exploit the](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [processing of control flags described in earlier TCP specifications](https://www.rfc-editor.org/info/rfc2873) [[33]](https://www.rfc-editor.org/errata/eid1571) [. TCP-MD5 was a commonly](https://www.rfc-editor.org/errata/eid1571) implemented TCP Option to support authentication for some of these connections, but had flaws

[and is now deprecated. TCP-AO provides a capability to protect long-lived TCP connections from](https://www.rfc-editor.org/info/rfc5927) [attacks and has superior properties to TCP-MD5. It does not provide any privacy for application](https://www.rfc-editor.org/info/rfc2883) data or for the TCP headers.

The "tcpcrypt" [[57]](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) [experimental extension to TCP provides the ability to cryptographically](https://www.rfc-editor.org/info/rfc2923) [protect connection data. Metadata aspects of the TCP flow are still visible, but the application](https://www.rfc-editor.org/info/rfc6429) [stream is well protected. Within the TCP header, only the urgent pointer and FIN flag are](https://www.rfc-editor.org/info/rfc791) protected through tcpcrypt.

The TCP Roadmap [[49]](https://www.rfc-editor.org/info/rfc8961) [includes notes about several RFCs related to TCP security. Many of the](https://www.rfc-editor.org/info/rfc1191) [enhancements provided by these RFCs have been integrated into the present document,](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) including ISN generation, mitigating blind in-window attacks, and improving handling of soft errors and ICMP packets. These are all discussed in greater detail in the referenced RFCs that [originally described the changes needed to earlier TCP specifications. Additionally, see RFC 6093](https://www.rfc-editor.org/info/rfc8548) [39] [for discussion of security considerations related to the urgent pointer field, which also](https://www.rfc-editor.org/info/rfc793) [discourages new applications from using the urgent pointer.](https://www.rfc-editor.org/info/rfc4727)

[Since TCP is often used for bulk transfer flows, some attacks are possible that abuse the TCP](https://www.rfc-editor.org/info/rfc2474) [congestion control logic. An example is "ACK-division" attacks. Updates that have been made to](https://www.rfc-editor.org/rfc/rfc6528#section-3) [the TCP congestion control specifications include mechanisms like Appropriate Byte Counting](https://www.rfc-editor.org/info/rfc2914) (ABC) [29] that act as mitigations to these attacks.

[Other attacks are focused on exhausting the resources of a TCP server. Examples include SYN](https://www.rfc-editor.org/ien/ien177.txt) flooding [32] [or wasting resources on non-progressing connections](https://www.rfc-editor.org/info/rfc3168) [41] . Operating systems [commonly implement mitigations for these attacks. Some common defenses also utilize proxies,](https://www.rfc-editor.org/info/rfc4953) [stateful firewalls, and other technologies outside the end-host TCP implementation.](https://www.rfc-editor.org/info/rfc7323)

[The concept of a protocol's "wire image" is described in RFC 8546](https://www.rfc-editor.org/info/rfc5044) [[56]](https://www.rfc-editor.org/info/rfc7413) [, which describes how TCP's](https://www.rfc-editor.org/info/rfc7413) cleartext headers expose more metadata to nodes on the path than is strictly required to route the packets to their destination. On-path adversaries may be able to leverage this metadata. [Lessons learned in this respect from TCP have been applied in the design of newer transports](https://www.rfc-editor.org/info/rfc5461) like QUIC [60] [. Additionally, based partly on experiences with TCP and its extensions, there are](https://www.rfc-editor.org/info/rfc7414) considerations that might be applicable for future TCP extensions and other transports that the [IETF has documented in RFC 9065](https://www.rfc-editor.org/info/rfc5961) [[61]](https://www.rfc-editor.org/info/rfc5961) [, along with IAB recommendations in RFC 8558](https://www.rfc-editor.org/errata/eid1283) [[58]](https://www.rfc-editor.org/errata/eid1283) [and](https://www.rfc-editor.org/info/rfc5570) [67] .

There are also methods of "fingerprinting" that can be used to infer the host TCP implementation [(operating system) version or platform information. These collect observations of several](https://www.rfc-editor.org/info/rfc5795) [aspects, such as the options present in segments, the ordering of options, the specific behaviors](https://www.rfc-editor.org/info/rfc8087) [in the case of various conditions, packet timing, packet sizing, and other aspects of the protocol](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [that are left to be determined by an implementer, and can use those observations to identify](https://www.rfc-editor.org/info/rfc9293) [information about the host and implementation.](https://www.rfc-editor.org/errata/eid3602)

[Since ICMP message processing also can interact with TCP connections, there is potential for](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [ICMP-based attacks against TCP connections. These are discussed in RFC 5927](https://www.rfc-editor.org/info/rfc2873) [[100]](https://www.rfc-editor.org/errata/eid1571) [, along with](https://www.rfc-editor.org/errata/eid1571) [mitigations that have been implemented.](https://www.rfc-editor.org/errata/eid1571)

## 8. References

### 8.1. Normative References

- [[1]](mailto:wes@mti-systems.com) [Postel, J. "Internet Protocol" STD 5 RFC 791 DOI 10.17487/RFC0791](https://www.rfc-editor.org/info/rfc791) [,](https://www.rfc-editor.org/info/rfc791) [,](https://www.rfc-editor.org/info/rfc791) [,](https://www.rfc-editor.org/info/rfc791) [,](https://www.rfc-editor.org/info/rfc791) [, September](https://www.rfc-editor.org/rfc/rfc1122#section-4.2.4.2) 1981, <[https://www.rfc-editor.org/info/rfc791](https://www.rfc-editor.org/info/rfc791)> [.](https://www.rfc-editor.org/errata/eid2748)

- [Mogul, J.](https://www.rfc-editor.org/info/rfc8961) and [S. Deering "Path MTU discovery" RFC 1191 DOI 10.17487/](https://www.rfc-editor.org/info/rfc1191) , [,](https://www.rfc-editor.org/info/rfc1191) [,](https://www.rfc-editor.org/info/rfc1191) [RFC1191](https://www.rfc-editor.org/rfc/rfc7657#section-5.3) [, November 1990,](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [<[https://www.rfc-editor.org/info/rfc1191](https://www.rfc-editor.org/info/rfc1191)>](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [.](https://www.rfc-editor.org/errata/eid2749)

- [Bradner, S. "Key words for use in RFCs to Indicate Requirement Levels" BCP 14](https://www.rfc-editor.org/info/rfc6691) [,](https://www.rfc-editor.org/info/rfc3465) [,](https://www.rfc-editor.org/info/rfc2119) , RFC 2119 DOI 10.17487/RFC2119 , [, March 1997,](https://www.rfc-editor.org/info/rfc8548) [<[https://www.rfc-editor.org/info/](https://www.rfc-editor.org/info/)](https://www.rfc-editor.org/errata/eid2934) [rfc2119>](https://www.rfc-editor.org/errata/eid2934) .

- [Nichols, K. Blake, S. Baker, F.](https://www.rfc-editor.org/info/rfc4727) [,](https://www.rfc-editor.org/info/rfc4727) [,](https://www.rfc-editor.org/info/rfc4727) [, and](https://www.rfc-editor.org/info/rfc8558) [D. Black "Definition of the Differentiated](https://www.iana.org/assignments/tcp-parameters/) [,](https://www.rfc-editor.org/info/rfc8558) [Services Field (DS Field) in the IPv4 and IPv6 Headers" RFC 2474 DOI 10.17487/](https://www.rfc-editor.org/info/rfc2474) [,](https://www.rfc-editor.org/info/rfc2474) [,](https://www.rfc-editor.org/info/rfc2474) RFC2474 , December 1998, [<[https://www.rfc-editor.org/info/rfc2474](https://www.rfc-editor.org/info/rfc2474)>](https://www.rfc-editor.org/info/rfc896) .

- [Floyd, S. "Congestion Control Principles" BCP 41 RFC 2914 DOI 10.17487/](https://www.rfc-editor.org/info/rfc2914) , [,](https://www.rfc-editor.org/info/rfc2914) [,](https://www.rfc-editor.org/info/rfc2914) [,](https://www.rfc-editor.org/info/rfc2914) [RFC2914](https://doi.org/10.1109/INFCOM.1999.752180) , September 2000, [<[https://www.rfc-editor.org/info/rfc2914](https://www.rfc-editor.org/info/rfc2914)>](https://www.rfc-editor.org/info/rfc1011) .

- Ramakrishnan, K. Floyd, S. , , and D. Black "The Addition of Explicit Congestion , [Notification (ECN) to IP" RFC 3168 DOI 10.17487/RFC3168](https://www.rfc-editor.org/info/rfc3168) [,](https://www.rfc-editor.org/info/rfc3168) [,](https://www.rfc-editor.org/info/rfc3168) [, September 2001,](https://www.rfc-editor.org/info/rfc1122) <[https://www.rfc-editor.org/info/rfc3168](https://www.rfc-editor.org/info/rfc3168)> [.](https://www.rfc-editor.org/info/rfc4953)

- [Floyd, S.](https://www.rfc-editor.org/rfc/rfc5461#section-4) [and](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [M. Allman "Specifying New Congestion Control Algorithms" BCP](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [,](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [,](https://www.rfc-editor.org/info/rfc5033) 133 RFC 5033 DOI 10.17487/RFC5033 [,](https://www.rfc-editor.org/info/rfc5033) , [, August 2007,](https://www.rfc-editor.org/info/rfc1349) [<[https://www.rfc-editor.org/](https://www.rfc-editor.org/)](https://www.rfc-editor.org/info/rfc1349) [info/rfc5033>](https://www.rfc-editor.org/info/rfc5044) [.](https://www.rfc-editor.org/info/rfc5044)

- [Allman, M. Paxson, V.](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.4.2) [,](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.4.2) , and [E. Blanton "TCP Congestion Control" RFC 5681 DOI](https://www.rfc-editor.org/info/rfc5681) [,](https://www.rfc-editor.org/info/rfc5681) [,](https://www.rfc-editor.org/info/rfc5681) [,](https://www.rfc-editor.org/info/rfc5681) [10.17487/RFC5681](https://www.iana.org/assignments/tcp-parameters/) [, September 2009,](https://www.rfc-editor.org/info/rfc5461) [<[https://www.rfc-editor.org/info/rfc5681](https://www.rfc-editor.org/info/rfc5681)>](https://www.rfc-editor.org/errata/eid700) [.](https://www.rfc-editor.org/errata/eid700)

- Ramaiah, A. Stewart, R. , , and [M. Dalal "Improving TCP's Robustness to Blind In-](https://www.rfc-editor.org/errata/eid701) , [Window Attacks" RFC 5961 DOI 10.17487/RFC5961](https://www.rfc-editor.org/info/rfc5961) [,](https://www.rfc-editor.org/info/rfc5961) [,](https://www.rfc-editor.org/info/rfc5961) [, August 2010,](https://www.rfc-editor.org/errata/eid1283) [<https://](https://www.rfc-editor.org/errata/eid1283) [www.rfc-editor.org/info/rfc5961>](https://www.rfc-editor.org/info/rfc2018) [.](https://www.rfc-editor.org/info/rfc2018)

- Paxson, V. Allman, M. Chu, J. , , , and [M. Sargent "Computing TCP's Retransmission](https://www.rfc-editor.org/info/rfc6298) [,](https://www.rfc-editor.org/errata/eid1561) Timer" RFC 6298 DOI 10.17487/RFC6298 [,](https://www.rfc-editor.org/info/rfc6298) , , June 2011, <[https://www.rfc-editor.org/](https://www.rfc-editor.org/) [info/rfc6298>](https://www.rfc-editor.org/info/rfc5795) [.](https://www.rfc-editor.org/info/rfc5795)

- [Gont, F. "Deprecation of ICMP Source Quench Messages" RFC 6633 DOI](https://www.rfc-editor.org/info/rfc6633) [,](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [,](https://www.rfc-editor.org/info/rfc6633) [,](https://www.rfc-editor.org/info/rfc6633) [10.17487/RFC6633](https://www.rfc-editor.org/info/rfc9293) [, May 2012,](https://www.rfc-editor.org/info/rfc9293) [<[https://www.rfc-editor.org/info/rfc6633](https://www.rfc-editor.org/info/rfc6633)>](https://www.rfc-editor.org/info/rfc2675) [.](https://www.rfc-editor.org/info/rfc2675)

- [Leiba, B. "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words" BCP](https://www.rfc-editor.org/info/rfc8095) , [,](https://www.rfc-editor.org/info/rfc8174) [14 RFC 8174 DOI 10.17487/RFC8174](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [,](https://www.rfc-editor.org/info/rfc8174) [,](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [, May 2017,](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [<[https://www.rfc-editor.org/info/](https://www.rfc-editor.org/info/)](https://www.rfc-editor.org/info/rfc6093) [rfc8174>](https://www.rfc-editor.org/info/rfc2873) [.](https://www.rfc-editor.org/rfc/rfc5961#section-5)

- [[13]](https://trustee.ietf.org/license-info) [Deering, S.](https://trustee.ietf.org/license-info) [and](https://trustee.ietf.org/license-info) [R. Hinden "Internet Protocol, Version 6 (IPv6) Specification" STD](https://www.rfc-editor.org/info/rfc6191) [,](https://trustee.ietf.org/license-info) [,](https://www.rfc-editor.org/info/rfc8200) [86 RFC 8200 DOI 10.17487/RFC8200](https://www.rfc-editor.org/info/rfc2883) [,](https://www.rfc-editor.org/info/rfc8200) [,](https://www.rfc-editor.org/info/rfc2883) [, July 2017,](https://www.rfc-editor.org/info/rfc2883) [<[https://www.rfc-editor.org/info/](https://www.rfc-editor.org/info/)](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [rfc8200>](https://www.rfc-editor.org/rfc/rfc9293) [.](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10)

- [[14]](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) McCann, J. Deering, S. Mogul, J. , , [, and](https://www.rfc-editor.org/info/rfc2923) [R. Hinden, Ed. "Path MTU Discovery for IP](https://www.rfc-editor.org/info/rfc2923) [,](https://www.rfc-editor.org/info/rfc2923) [version 6" STD 87 RFC 8201 DOI 10.17487/RFC8201](https://www.rfc-editor.org/info/rfc6429) [,](https://www.rfc-editor.org/info/rfc8201) [,](https://www.rfc-editor.org/info/rfc8201) [,](https://www.rfc-editor.org/info/rfc6429) [, July 2017,](https://www.rfc-editor.org/errata/eid2298) [<[https://www.rfc-](https://www.rfc-)](https://www.rfc-editor.org/info/rfc9170) [editor.org/info/rfc8201>](https://www.rfc-editor.org/info/rfc791) [.](https://www.rfc-editor.org/info/rfc791)

- [Allman, M. "Requirements for Time-Based Loss Detection" BCP 233 RFC 8961](https://www.rfc-editor.org/info/rfc3449) , [,](https://www.rfc-editor.org/info/rfc8961) [,](https://www.rfc-editor.org/info/rfc8961) , DOI 10.17487/RFC8961 [, November 2020,](https://www.rfc-editor.org/info/rfc1191) [<[https://www.rfc-editor.org/info/](https://www.rfc-editor.org/info/)](https://www.rfc-editor.org/info/rfc1191) [rfc8961>](https://www.rfc-editor.org/rfc/rfc7657#section-5.3) [.](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

### 8.2. [Informative References](https://www.rfc-editor.org/info/rfc3465)

- [Postel, J. "Transmission Control Protocol" STD 7 RFC 793 DOI 10.17487/](https://www.rfc-editor.org/info/rfc793) , [,](https://www.rfc-editor.org/info/rfc793) [,](https://www.rfc-editor.org/info/rfc793) [,](https://www.rfc-editor.org/info/rfc793) [RFC0793](https://doi.org/10.1016/0376-5075(78)90053-3) [, September 1981,](https://doi.org/10.1016/0376-5075(78)90053-3) [<[https://www.rfc-editor.org/info/rfc793](https://www.rfc-editor.org/info/rfc793)>](https://www.iana.org/assignments/tcp-parameters/) [.](https://www.iana.org/assignments/tcp-parameters/)

- [Nagle, J. "Congestion Control in IP/TCP Internetworks" RFC 896 DOI 10.17487/](https://www.rfc-editor.org/info/rfc2474) , [,](https://www.rfc-editor.org/info/rfc2474) [,](https://www.rfc-editor.org/info/rfc2474) RFC0896 , January 1984, [<[https://www.rfc-editor.org/info/rfc896](https://www.rfc-editor.org/info/rfc896)>](https://www.rfc-editor.org/info/rfc6994) .

- [Reynolds, J.](https://doi.org/10.1109/INFCOM.1999.752180) and [J. Postel "Official Internet protocols" RFC 1011 DOI 10.17487/](https://www.rfc-editor.org/info/rfc2914) [,](https://www.rfc-editor.org/info/rfc1011) [,](https://www.rfc-editor.org/info/rfc2914) [,](https://www.rfc-editor.org/info/rfc2914) RFC1011 , May 1987, <[https://www.rfc-editor.org/info/rfc1011](https://www.rfc-editor.org/info/rfc1011)> .

- [Braden, R., Ed. "Requirements for Internet Hosts - Communication Layers" STD](https://www.rfc-editor.org/ien/ien177.txt) [,](https://www.rfc-editor.org/ien/ien177.txt) [,](https://www.rfc-editor.org/info/rfc1122) [3 RFC 1122 DOI 10.17487/RFC1122](https://www.rfc-editor.org/info/rfc3168) [,](https://www.rfc-editor.org/info/rfc3168) [,](https://www.rfc-editor.org/info/rfc3168) , October 1989, <[https://www.rfc-editor.org/](https://www.rfc-editor.org/) info/rfc1122> .

- [Almquist, P. "Type of Service in the Internet Protocol Suite" RFC 1349 DOI](https://www.rfc-editor.org/info/rfc1349) , [,](https://www.rfc-editor.org/info/rfc5033) [,](https://www.rfc-editor.org/info/rfc5033) [10.17487/RFC1349](https://www.rfc-editor.org/info/rfc5033) , July 1992, [<[https://www.rfc-editor.org/info/rfc1349](https://www.rfc-editor.org/info/rfc1349)>](https://www.rfc-editor.org/errata/eid573) [.](https://www.rfc-editor.org/info/rfc9065)

- [Braden, R. "T/TCP -- TCP Extensions for Transactions Functional Specification"](https://www.rfc-editor.org/errata/eid574) [,](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.4.2) [,](https://www.rfc-editor.org/errata/eid574) RFC 1644 DOI 10.17487/RFC1644 , [, July 1994,](https://www.rfc-editor.org/info/rfc5681) [<[https://www.rfc-editor.org/info/](https://www.rfc-editor.org/info/)](https://www.rfc-editor.org/info/rfc5681) [rfc1644>](https://www.iana.org/assignments/tcp-parameters/) [.](https://www.iana.org/assignments/tcp-parameters/)

- Mathis, M. Mahdavi, J. Floyd, S. , , , and [A. Romanow "TCP Selective](https://www.rfc-editor.org/errata/eid701) [,](https://www.rfc-editor.org/errata/eid701) [Acknowledgment Options" RFC 2018 DOI 10.17487/RFC2018](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [,](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [,](https://www.rfc-editor.org/info/rfc2018) [, October 1996,](https://www.rfc-editor.org/errata/eid1283) [<[https://www.rfc-editor.org/info/rfc2018](https://www.rfc-editor.org/info/rfc2018)>](https://www.rfc-editor.org/info/rfc5570) [.](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00)

- Paxson, V. Allman, M. Dawson, S. Fenner, W. Griner, J. Heavens, I. Lahey, K. , , , [,](https://www.rfc-editor.org/errata/eid1561) [,](https://www.rfc-editor.org/info/rfc6298) [,](https://www.rfc-editor.org/info/rfc6298) [,](https://www.rfc-editor.org/info/rfc6298) [Semke, J.](https://www.rfc-editor.org/info/rfc6298) [, and](https://www.rfc-editor.org/info/rfc6298) [B. Volz "Known TCP Implementation Problems" RFC 2525 DOI](https://www.rfc-editor.org/info/rfc2525) , [,](https://www.rfc-editor.org/info/rfc2525) [,](https://www.rfc-editor.org/info/rfc5795) [10.17487/RFC2525](https://www.rfc-editor.org/info/rfc5795) [, March 1999,](https://www.rfc-editor.org/info/rfc5795) [<[https://www.rfc-editor.org/info/rfc2525](https://www.rfc-editor.org/info/rfc2525)>](https://www.rfc-editor.org/errata/eid3305) [.](https://www.rfc-editor.org/info/rfc8087)

- Borman, D. Deering, S. , [, and](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4) [R. Hinden "IPv6 Jumbograms" RFC 2675 DOI](https://www.rfc-editor.org/info/rfc6633) [,](https://www.rfc-editor.org/info/rfc6633) [,](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.5) [,](https://www.rfc-editor.org/info/rfc6633) [10.17487/RFC2675](https://www.rfc-editor.org/info/rfc9293) [, August 1999,](https://www.rfc-editor.org/info/rfc9293) [<[https://www.rfc-editor.org/info/rfc2675](https://www.rfc-editor.org/info/rfc2675)>](https://www.rfc-editor.org/info/rfc5925) [.](https://www.rfc-editor.org/info/rfc5925)

- [Xiao, X. Hannan, A. Paxson, V.](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [,](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [,](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [, and](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [E. Crabbe "TCP Processing of the IPv4](https://www.rfc-editor.org/info/rfc8174) [,](https://www.rfc-editor.org/info/rfc8095) [Precedence Field" RFC 2873 DOI 10.17487/RFC2873](https://www.rfc-editor.org/info/rfc2873) [,](https://www.rfc-editor.org/info/rfc2873) [,](https://www.rfc-editor.org/info/rfc2873) [, June 2000,](https://www.rfc-editor.org/errata/eid4772) [<https://](https://www.rfc-editor.org/info/rfc6093) [www.rfc-editor.org/info/rfc2873>](https://www.rfc-editor.org/info/rfc6093) .

- [[26]](https://trustee.ietf.org/license-info) [Floyd, S. Mahdavi, J. Mathis, M.](https://trustee.ietf.org/license-info) [,](https://trustee.ietf.org/license-info) [,](https://trustee.ietf.org/license-info) [, and](https://www.rfc-editor.org/info/rfc5927) [M. Podolsky "An Extension to the Selective](https://www.rfc-editor.org/info/rfc8200) [,](https://www.rfc-editor.org/info/rfc8200) [Acknowledgement (SACK) Option for TCP" RFC 2883 DOI 10.17487/RFC2883](https://www.rfc-editor.org/info/rfc2883) [,](https://www.rfc-editor.org/info/rfc2883) , , [July 2000,](https://www.rfc-editor.org/rfc/rfc9293) [<[https://www.rfc-editor.org/info/rfc2883](https://www.rfc-editor.org/info/rfc2883)>](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [.](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10)

- [[27]](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) [Lahey, K. "TCP Problems with Path MTU Discovery" RFC 2923 DOI 10.17487/](https://www.rfc-editor.org/info/rfc2923) [,](https://www.rfc-editor.org/rfc/rfc1122) [,](https://www.rfc-editor.org/info/rfc2923) [,](https://www.rfc-editor.org/info/rfc2923) [RFC2923](https://www.rfc-editor.org/info/rfc8201) [, September 2000,](https://www.rfc-editor.org/info/rfc8201) [<[https://www.rfc-editor.org/info/rfc2923](https://www.rfc-editor.org/info/rfc2923)>](https://www.rfc-editor.org/errata/eid2298) [.](https://www.rfc-editor.org/info/rfc9170)

- [[28]](mailto:wes@mti-systems.com) [Balakrishnan, H. Padmanabhan, V. Fairhurst, G.](https://www.rfc-editor.org/info/rfc791) [,](https://www.rfc-editor.org/info/rfc791) [,](https://www.rfc-editor.org/info/rfc791) , and M. Sooriyabandara "TCP , [Performance Implications of Network Path Asymmetry" BCP 69 RFC 3449 DOI](https://www.rfc-editor.org/info/rfc3449) [,](https://www.rfc-editor.org/info/rfc8961) [,](https://www.rfc-editor.org/info/rfc8961) [,](https://www.rfc-editor.org/info/rfc3449) 10.17487/RFC3449 , December 2002, [<[https://www.rfc-editor.org/info/rfc3449](https://www.rfc-editor.org/info/rfc3449)>](https://www.rfc-editor.org/info/rfc1191) .

- [Allman, M. "TCP Congestion Control with Appropriate Byte Counting (ABC)"](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [,](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [,](https://www.rfc-editor.org/info/rfc3465) RFC 3465 DOI 10.17487/RFC3465 [,](https://www.rfc-editor.org/info/rfc3465) [, February 2003,](https://www.rfc-editor.org/info/rfc6691) [<[https://www.rfc-editor.org/](https://www.rfc-editor.org/)](https://www.rfc-editor.org/info/rfc2119) [info/rfc3465>](https://www.rfc-editor.org/info/rfc2119) .

- [Fenner, B. "Experimental Values In IPv4, IPv6, ICMPv4, ICMPv6, UDP, and TCP](https://www.rfc-editor.org/info/rfc793) , [Headers" RFC 4727 DOI 10.17487/RFC4727](https://www.rfc-editor.org/info/rfc4727) [,](https://www.rfc-editor.org/info/rfc4727) [,](https://www.rfc-editor.org/info/rfc4727) [, November 2006,](https://www.iana.org/assignments/tcp-parameters/) [<[https://www.rfc-](https://www.rfc-)](https://www.iana.org/assignments/tcp-parameters/) editor.org/info/rfc4727> .

- Mathis, M. and [J. Heffner "Packetization Layer Path MTU Discovery" RFC 4821](https://www.rfc-editor.org/info/rfc4821) , [,](https://www.rfc-editor.org/info/rfc4821) , DOI 10.17487/RFC4821 [, March 2007,](https://www.rfc-editor.org/info/rfc2914) [<[https://www.rfc-editor.org/info/rfc4821](https://www.rfc-editor.org/info/rfc4821)>](https://www.rfc-editor.org/info/rfc2914) .

- [Eddy, W. "TCP SYN Flooding Attacks and Common Mitigations" RFC 4987 DOI](https://www.rfc-editor.org/info/rfc4987) [,](https://www.rfc-editor.org/info/rfc7094) [,](https://www.rfc-editor.org/info/rfc4987) , 10.17487/RFC4987 , August 2007, [<[https://www.rfc-editor.org/info/rfc4987](https://www.rfc-editor.org/info/rfc4987)>](https://www.rfc-editor.org/errata/eid3301) .

- [Touch, J. "Defending TCP Against Spoofing Attacks" RFC 4953 DOI 10.17487/](https://www.rfc-editor.org/info/rfc3168) [,](https://www.rfc-editor.org/info/rfc3168) [,](https://www.rfc-editor.org/info/rfc4953) , [RFC4953](https://www.rfc-editor.org/info/rfc7323) [, July 2007,](https://www.rfc-editor.org/info/rfc7323) [<[https://www.rfc-editor.org/info/rfc4953](https://www.rfc-editor.org/info/rfc4953)>](https://www.rfc-editor.org/errata/eid6222) [.](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html)

- [Culley, P. Elzur, U. Recio, R. Bailey, S.](https://www.rfc-editor.org/rfc/rfc5681#section-4.2) , , , [, and](https://www.rfc-editor.org/info/rfc1349) [J. Carrier "Marker PDU Aligned](https://www.rfc-editor.org/info/rfc5033) [,](https://www.rfc-editor.org/info/rfc1349) [Framing for TCP Specification" RFC 5044 DOI 10.17487/RFC5044](https://www.rfc-editor.org/info/rfc5044) [,](https://www.rfc-editor.org/info/rfc5044) [,](https://www.rfc-editor.org/info/rfc7413) [, October 2007,](https://www.rfc-editor.org/info/rfc7413) [<[https://www.rfc-editor.org/info/rfc5044](https://www.rfc-editor.org/info/rfc5044)>](https://www.rfc-editor.org/info/rfc9065) [.](https://www.rfc-editor.org/rfc/rfc5961#section-1.1)

- [Gont, F. "TCP's Reaction to Soft Errors" RFC 5461 DOI 10.17487/RFC5461](https://www.rfc-editor.org/info/rfc5461) , [,](https://www.rfc-editor.org/info/rfc5681) [,](https://www.rfc-editor.org/info/rfc5681) [,](https://www.rfc-editor.org/info/rfc5681) [February 2009,](https://www.iana.org/assignments/tcp-parameters/) [<[https://www.rfc-editor.org/info/rfc5461](https://www.rfc-editor.org/info/rfc5461)>](https://www.rfc-editor.org/info/rfc7414) [.](https://www.rfc-editor.org/info/rfc7414)

- StJohns, M. Atkinson, R. , , and [G. Thomas "Common Architecture Label IPv6](https://www.rfc-editor.org/errata/eid1569) [,](https://www.rfc-editor.org/errata/eid1569) [Security Option (CALIPSO)" RFC 5570 DOI 10.17487/RFC5570](https://www.rfc-editor.org/info/rfc5961) [,](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [,](https://www.rfc-editor.org/info/rfc2018) [, July 2009,](https://www.rfc-editor.org/errata/eid1283) [<https://](https://www.rfc-editor.org/info/rfc7657) [www.rfc-editor.org/info/rfc5570>](https://www.rfc-editor.org/info/rfc7657) [.](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00)

- Sandlund, K. Pelletier, G. , , and [L-E. Jonsson "The RObust Header Compression](https://www.rfc-editor.org/info/rfc6298) [,](https://www.rfc-editor.org/errata/eid1561) [(ROHC) Framework" RFC 5795 DOI 10.17487/RFC5795](https://www.rfc-editor.org/info/rfc5795) [,](https://www.rfc-editor.org/info/rfc5795) [,](https://www.rfc-editor.org/info/rfc5795) [, March 2010,](https://www.rfc-editor.org/info/rfc2525) [<https://](https://www.rfc-editor.org/info/rfc8087) [www.rfc-editor.org/info/rfc5795>](https://www.rfc-editor.org/info/rfc8087) .

- [Touch, J. Mankin, A.](https://www.rfc-editor.org/info/rfc9293) [,](https://www.rfc-editor.org/info/rfc9293) [, and](https://www.rfc-editor.org/info/rfc9293) [R. Bonica "The TCP Authentication Option" RFC 5925](https://www.rfc-editor.org/info/rfc6633) [,](https://www.rfc-editor.org/info/rfc9293) [,](https://www.rfc-editor.org/info/rfc6633) , DOI 10.17487/RFC5925 , June 2010, [<[https://www.rfc-editor.org/info/rfc5925](https://www.rfc-editor.org/info/rfc5925)>](https://www.rfc-editor.org/errata/eid3602) .

- [Gont, F.](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [and](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [A. Yourtchenko "On the Implementation of the TCP Urgent](https://www.rfc-editor.org/info/rfc8095) [,](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [Mechanism" RFC 6093 DOI 10.17487/RFC6093](https://www.rfc-editor.org/info/rfc2873) [,](https://www.rfc-editor.org/rfc/rfc5961#section-5) [,](https://www.rfc-editor.org/info/rfc2873) [, January 2011,](https://www.rfc-editor.org/errata/eid4772) [<[https://www.rfc-](https://www.rfc-)](https://www.rfc-editor.org/errata/eid4772) editor.org/info/rfc6093> .

- [[40]](https://trustee.ietf.org/license-info) [Gont, F. "Reducing the TIME-WAIT State Using TCP Timestamps" BCP 159 RFC](https://www.rfc-editor.org/info/rfc5927) [,](https://trustee.ietf.org/license-info) [,](https://www.rfc-editor.org/rfc/rfc1122#section-4.2.2.2) [,](https://www.rfc-editor.org/info/rfc8200) [6191 DOI 10.17487/RFC6191](https://www.rfc-editor.org/info/rfc2883) [,](https://www.rfc-editor.org/info/rfc8200) [, April 2011,](https://www.rfc-editor.org/info/rfc2883) <[https://www.rfc-editor.org/info/](https://www.rfc-editor.org/info/) [rfc6191>](https://www.rfc-editor.org/rfc/rfc9293) [.](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10)

- [[41]](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) [Bashyam, M. Jethanandani, M.](https://www.rfc-editor.org/rfc/rfc5961) [,](https://www.rfc-editor.org/rfc/rfc5961) [, and](https://www.rfc-editor.org/info/rfc2923) [A. Ramaiah "TCP Sender Clarification for](https://www.rfc-editor.org/info/rfc2923) [,](https://www.rfc-editor.org/info/rfc2923) [Persist Condition" RFC 6429 DOI 10.17487/RFC6429](https://www.rfc-editor.org/info/rfc6429) [,](https://www.rfc-editor.org/info/rfc8201) [,](https://www.rfc-editor.org/info/rfc6429) [, December 2011,](https://www.rfc-editor.org/errata/eid2298) [<https://](https://www.rfc-editor.org/errata/eid2298) [www.rfc-editor.org/info/rfc6429>](https://www.rfc-editor.org/info/rfc791) [.](https://www.rfc-editor.org/info/rfc791)

- Gont, F. and [S. Bellovin "Defending against Sequence Number Attacks" RFC](https://www.rfc-editor.org/info/rfc8961) , [,](https://www.rfc-editor.org/info/rfc8961) 6528 DOI 10.17487/RFC6528 [,](https://www.rfc-editor.org/info/rfc8961) [, February 2012,](https://www.rfc-editor.org/rfc/rfc8200#section-8.1) [<[https://www.rfc-editor.org/info/](https://www.rfc-editor.org/info/)](https://www.rfc-editor.org/info/rfc1191) [rfc6528>](https://www.rfc-editor.org/rfc/rfc7657#section-5.3) [.](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

- [Borman, D. "TCP Options and Maximum Segment Size (MSS)" RFC 6691 DOI](https://www.rfc-editor.org/info/rfc6691) [,](https://www.rfc-editor.org/info/rfc3465) [,](https://www.rfc-editor.org/info/rfc2119) [,](https://www.rfc-editor.org/info/rfc2119) 10.17487/RFC6691 [, July 2012,](https://www.rfc-editor.org/info/rfc8548) [<[https://www.rfc-editor.org/info/rfc6691](https://www.rfc-editor.org/info/rfc6691)>](https://www.rfc-editor.org/info/rfc8548) .

- [Touch, J. "Updated Specification of the IPv4 ID Field" RFC 6864 DOI 10.17487/](https://www.rfc-editor.org/info/rfc793) , [,](https://www.rfc-editor.org/rfc/rfc793#section-3) [,](https://www.rfc-editor.org/info/rfc793) [RFC6864](https://www.rfc-editor.org/info/rfc4727) [, February 2013,](https://www.rfc-editor.org/info/rfc4727) [<[https://www.rfc-editor.org/info/rfc6864](https://www.rfc-editor.org/info/rfc6864)>](https://www.iana.org/assignments/tcp-parameters/) [.](https://www.iana.org/assignments/tcp-parameters/)

- [Touch, J. "Shared Use of Experimental TCP Options" RFC 6994 DOI 10.17487/](https://www.rfc-editor.org/info/rfc2474) , [,](https://www.rfc-editor.org/info/rfc2474) [,](https://www.rfc-editor.org/info/rfc2474) RFC6994 , August 2013, [<[https://www.rfc-editor.org/info/rfc6994](https://www.rfc-editor.org/info/rfc6994)>](https://www.rfc-editor.org/info/rfc4821) [.](https://www.rfc-editor.org/info/rfc4821)

- McPherson, D. Oran, D. Thaler, D. , [,](https://www.rfc-editor.org/info/rfc1011) [, and](https://www.rfc-editor.org/info/rfc2914) [E. Osterweil "Architectural](https://www.rfc-editor.org/info/rfc2914) [,](https://www.rfc-editor.org/info/rfc2914) [Considerations of IP Anycast" RFC 7094 DOI 10.17487/RFC7094](https://www.rfc-editor.org/info/rfc7094) [,](https://www.rfc-editor.org/info/rfc7094) [,](https://www.rfc-editor.org/info/rfc4987) [, January 2014,](https://www.rfc-editor.org/info/rfc4987) <[https://www.rfc-editor.org/info/rfc7094](https://www.rfc-editor.org/info/rfc7094)> [.](https://www.rfc-editor.org/errata/eid3301)

- [Borman, D. Braden, B. Jacobson, V.](https://www.rfc-editor.org/info/rfc3168) [,](https://www.rfc-editor.org/info/rfc3168) [,](https://www.rfc-editor.org/info/rfc3168) [, and](https://www.rfc-editor.org/info/rfc3168) [R. Scheffenegger, Ed. "TCP Extensions](https://www.rfc-editor.org/info/rfc4953) , [for High Performance" RFC 7323 DOI 10.17487/RFC7323](https://www.rfc-editor.org/info/rfc7323) [,](https://www.rfc-editor.org/info/rfc7323) [,](https://www.rfc-editor.org/info/rfc7323) [, September 2014,](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [<[https://www.rfc-editor.org/info/rfc7323](https://www.rfc-editor.org/info/rfc7323)>](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [.](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html)

- [Cheng, Y. Chu, J. Radhakrishnan, S.](https://www.rfc-editor.org/info/rfc5044) [,](https://www.rfc-editor.org/info/rfc5033) [,](https://www.rfc-editor.org/info/rfc5044) [, and](https://www.rfc-editor.org/info/rfc5044) [A. Jain "TCP Fast Open" RFC 7413 DOI](https://www.rfc-editor.org/info/rfc7413) [,](https://www.rfc-editor.org/info/rfc7413) [,](https://www.rfc-editor.org/info/rfc7413) [,](https://www.rfc-editor.org/info/rfc7413) [10.17487/RFC7413](https://www.rfc-editor.org/info/rfc9065) , December 2014, [<[https://www.rfc-editor.org/info/rfc7413](https://www.rfc-editor.org/info/rfc7413)>](https://www.rfc-editor.org/errata/eid574) [.](https://www.rfc-editor.org/errata/eid574)

- [Duke, M. Braden, R. Eddy, W. Blanton, E.](https://www.rfc-editor.org/info/rfc5461) , [,](https://www.rfc-editor.org/info/rfc5461) [,](https://www.rfc-editor.org/info/rfc5461) [, and](https://www.rfc-editor.org/info/rfc5681) [A. Zimmermann "A Roadmap for](https://www.rfc-editor.org/info/rfc5681) [,](https://www.rfc-editor.org/info/rfc5681) [Transmission Control Protocol (TCP) Specification Documents" RFC 7414 DOI](https://www.rfc-editor.org/info/rfc7414) [,](https://www.rfc-editor.org/info/rfc7414) [,](https://www.rfc-editor.org/info/rfc7414) 10.17487/RFC7414 , February 2015, [<[https://www.rfc-editor.org/info/rfc7414](https://www.rfc-editor.org/info/rfc7414)>](https://www.rfc-editor.org/errata/eid701) [.](https://www.rfc-editor.org/errata/eid701)

- [Black, D., Ed.](https://www.rfc-editor.org/info/rfc5961) [and](https://www.rfc-editor.org/info/rfc5961) [P. Jones "Differentiated Services (Diffserv) and Real-Time](https://www.rfc-editor.org/errata/eid1283) [,](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [Communication" RFC 7657 DOI 10.17487/RFC7657](https://www.rfc-editor.org/info/rfc7657) [,](https://www.rfc-editor.org/info/rfc7657) [,](https://www.rfc-editor.org/info/rfc7657) [, November 2015,](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) [<https://](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) www.rfc-editor.org/info/rfc7657> .

- [Fairhurst, G.](https://www.rfc-editor.org/info/rfc6298) [and](https://www.rfc-editor.org/info/rfc5795) [M. Welzl "The Benefits of Using Explicit Congestion](https://www.rfc-editor.org/info/rfc2525) [,](https://www.rfc-editor.org/info/rfc5795) [Notification (ECN)" RFC 8087 DOI 10.17487/RFC8087](https://www.rfc-editor.org/info/rfc8087) [,](https://www.rfc-editor.org/info/rfc8087) [,](https://www.rfc-editor.org/info/rfc8087) [, March 2017,](https://www.rfc-editor.org/errata/eid3305) [<https://](https://www.rfc-editor.org/errata/eid3305) [www.rfc-editor.org/info/rfc8087>](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4) [.](https://www.rfc-editor.org/info/rfc6633)

- [[52]](https://www.rfc-editor.org/rfc/rfc8095#section-3.1) Fairhurst, G., Ed. Trammell, B., Ed. , , and [M. Kuehlewind, Ed. "Services Provided](https://www.rfc-editor.org/errata/eid3602) [,](https://www.rfc-editor.org/errata/eid3602) [by IETF Transport Protocols and Congestion Control Mechanisms" RFC 8095](https://www.rfc-editor.org/info/rfc8095) [,](https://www.rfc-editor.org/info/rfc8174) [,](https://www.rfc-editor.org/info/rfc8174) [DOI 10.17487/RFC8095](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [, March 2017,](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [<[https://www.rfc-editor.org/info/rfc8095](https://www.rfc-editor.org/info/rfc8095)>](https://www.rfc-editor.org/errata/eid4772) [.](https://www.rfc-editor.org/info/rfc6093)

- Welzl, M. Tuexen, M. , , and [N. Khademi "On the Usage of Transport Features](https://www.rfc-editor.org/errata/eid1571) , [Provided by IETF Transport Protocols" RFC 8303 DOI 10.17487/RFC8303](https://www.rfc-editor.org/info/rfc8303) [,](https://www.rfc-editor.org/info/rfc8303) [,](https://www.rfc-editor.org/info/rfc8303) , February 2018, <[https://www.rfc-editor.org/info/rfc8303](https://www.rfc-editor.org/info/rfc8303)> .

- [[54]](https://trustee.ietf.org/license-info) [Black, D. "Relaxing Restrictions on Explicit Congestion Notification (ECN)](https://www.rfc-editor.org/info/rfc5927) [,](https://trustee.ietf.org/license-info) [Experimentation" RFC 8311 DOI 10.17487/RFC8311](https://www.rfc-editor.org/info/rfc2883) [,](https://www.rfc-editor.org/info/rfc2883) [,](https://www.rfc-editor.org/info/rfc2883) , January 2018, <https:// [www.rfc-editor.org/info/rfc8311>](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [.](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10)

- [[55]](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) Chown, T. Loughney, J. [,](https://www.rfc-editor.org/rfc/rfc1122) , and [T. Winters "IPv6 Node Requirements" BCP 220 RFC](https://www.rfc-editor.org/info/rfc2923) [,](https://www.rfc-editor.org/info/rfc2923) [,](https://www.rfc-editor.org/info/rfc8201) [,](https://www.rfc-editor.org/info/rfc8201) [8504 DOI 10.17487/RFC8504](https://www.rfc-editor.org/info/rfc8201) [,](https://www.rfc-editor.org/info/rfc8201) , January 2019, [<[https://www.rfc-editor.org/info/](https://www.rfc-editor.org/info/)](https://www.rfc-editor.org/errata/eid2298) [rfc8504>](https://www.rfc-editor.org/info/rfc9170) [.](https://www.rfc-editor.org/info/rfc791)

- Trammell, B. and [M. Kuehlewind "The Wire Image of a Network Protocol" RFC](https://www.rfc-editor.org/info/rfc8961) , [,](https://www.rfc-editor.org/info/rfc3449) 8546 DOI 10.17487/RFC8546 [,](https://www.rfc-editor.org/info/rfc8961) [, April 2019,](https://www.rfc-editor.org/info/rfc1191) [<[https://www.rfc-editor.org/info/](https://www.rfc-editor.org/info/)](https://www.rfc-editor.org/info/rfc1191) [rfc8546>](https://www.rfc-editor.org/rfc/rfc7657#section-5.3) [.](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

- Bittau, A. Giffin, D. Handley, M. Mazieres, D. Slack, Q. [,](https://www.rfc-editor.org/info/rfc3465) , [,](https://www.rfc-editor.org/info/rfc6691) [,](https://www.rfc-editor.org/info/rfc6691) [, and](https://www.rfc-editor.org/info/rfc2119) [E. Smith](https://www.rfc-editor.org/info/rfc2119) [,](https://www.rfc-editor.org/info/rfc2119) ["Cryptographic Protection of TCP Streams (tcpcrypt)" RFC 8548 DOI 10.17487/](https://www.rfc-editor.org/info/rfc8548) [,](https://www.rfc-editor.org/info/rfc8548) , RFC8548 , May 2019, [<[https://www.rfc-editor.org/info/rfc8548](https://www.rfc-editor.org/info/rfc8548)>](https://www.rfc-editor.org/errata/eid2934) [.](https://doi.org/10.1016/0376-5075(78)90053-3)

- [Hardie, T., Ed. "Transport Protocol Path Signals" RFC 8558 DOI 10.17487/](https://www.rfc-editor.org/info/rfc8558) [,](https://www.rfc-editor.org/info/rfc4727) [,](https://www.iana.org/assignments/tcp-parameters/) [,](https://www.iana.org/assignments/tcp-parameters/) RFC8558 , April 2019, [<[https://www.rfc-editor.org/info/rfc8558](https://www.rfc-editor.org/info/rfc8558)>](https://www.rfc-editor.org/info/rfc2474) [.](https://www.rfc-editor.org/info/rfc2474)

- Ford, A. Raiciu, C. Handley, M. Bonaventure, O. , , , [, and](https://www.rfc-editor.org/info/rfc4821) [C. Paasch "TCP Extensions](https://www.rfc-editor.org/info/rfc4821) [,](https://www.rfc-editor.org/info/rfc4821) [for Multipath Operation with Multiple Addresses" RFC 8684 DOI 10.17487/](https://www.rfc-editor.org/rfc/rfc6528#section-3) [,](https://www.rfc-editor.org/info/rfc2914) [,](https://www.rfc-editor.org/info/rfc2914) [RFC8684](https://doi.org/10.1109/INFCOM.1999.752180) , March 2020, [<[https://www.rfc-editor.org/info/rfc8684](https://www.rfc-editor.org/info/rfc8684)>](https://www.rfc-editor.org/info/rfc1011) .

- Iyengar, J., Ed. and [M. Thomson, Ed. "QUIC: A UDP-Based Multiplexed and](https://www.rfc-editor.org/errata/eid3301) , [Secure Transport" RFC 9000 DOI 10.17487/RFC9000](https://www.rfc-editor.org/info/rfc3168) [,](https://www.rfc-editor.org/info/rfc3168) [,](https://www.rfc-editor.org/info/rfc3168) [, May 2021,](https://www.rfc-editor.org/info/rfc1122) [<https://](https://www.rfc-editor.org/info/rfc1122) www.rfc-editor.org/info/rfc9000> [.](https://www.rfc-editor.org/info/rfc4953)

- [Fairhurst, G.](https://www.rfc-editor.org/rfc/rfc5461#section-4) [and](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [C. Perkins "Considerations around Transport Header](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [,](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [Confidentiality, Network Operations, and the Evolution of Internet Transport](https://www.rfc-editor.org/info/rfc1349) [Protocols" RFC 9065 DOI 10.17487/RFC9065](https://www.rfc-editor.org/info/rfc5044) [,](https://www.rfc-editor.org/info/rfc5044) [,](https://www.rfc-editor.org/info/rfc5044) [, July 2021,](https://www.rfc-editor.org/info/rfc7413) [<[https://www.rfc-](https://www.rfc-)](https://www.rfc-editor.org/info/rfc7413) [editor.org/info/rfc9065>](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.4.2) .

- [IANA "Transmission Control Protocol (TCP) Parameters" <[https://www.iana.org/](https://www.iana.org/)](https://www.rfc-editor.org/info/rfc5461) [,](https://www.rfc-editor.org/info/rfc1644) [,](https://www.rfc-editor.org/errata/eid700) assignments/tcp-parameters/> .

- [Gont, F. "Processing of IP Security/Compartment and Precedence Information by](https://www.rfc-editor.org/errata/eid1569) [,](https://www.rfc-editor.org/info/rfc5961) [TCP" Work in Progress Internet-Draft, draft-gont-tcpm-tcp-seccomp-prec-00](https://www.rfc-editor.org/info/rfc2018) [,](https://www.rfc-editor.org/info/rfc2018) [,](https://www.rfc-editor.org/info/rfc2018) [, 29](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) [March 2012,](https://www.rfc-editor.org/info/rfc7657) [<[https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-)](https://www.rfc-editor.org/errata/eid2296) [prec-00>](https://www.rfc-editor.org/errata/eid2296) .

- [Gont, F.](https://www.rfc-editor.org/info/rfc5795) [and](https://www.rfc-editor.org/info/rfc5795) [D. Borman "On the Validation of TCP Sequence Numbers" Work in](https://www.rfc-editor.org/info/rfc2525) [,](https://www.rfc-editor.org/info/rfc5795) [,](https://www.rfc-editor.org/info/rfc2525) [Progress Internet-Draft, draft-gont-tcpm-tcp-seq-validation-04](https://www.rfc-editor.org/info/rfc8087) [,](https://www.rfc-editor.org/info/rfc8087) [, 11 March 2019,](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [<[https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04)>](https://www.rfc-editor.org/info/rfc6633) .

- [[65]](https://www.rfc-editor.org/rfc/rfc8095#section-3.1) [Touch, J.](https://www.rfc-editor.org/errata/eid3602) and [W. M. Eddy "TCP Extended Data Offset Option" Work in Progress](https://www.rfc-editor.org/errata/eid1564) , [,](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) , [Internet-Draft, draft-ietf-tcpm-tcp-edo-12](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [, 15 April 2022,](https://www.rfc-editor.org/info/rfc8095) [<https://](https://www.rfc-editor.org/info/rfc8174) [datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12>](https://www.rfc-editor.org/info/rfc2873) [.](https://www.rfc-editor.org/errata/eid4772)

- [[66]](https://trustee.ietf.org/license-info) [McQuistin, S. Band, V. Jacob, D.](https://trustee.ietf.org/license-info) [,](https://trustee.ietf.org/license-info) [,](https://trustee.ietf.org/license-info) [, and](https://www.rfc-editor.org/info/rfc5927) [C. Perkins "Describing Protocol Data Units](https://www.rfc-editor.org/info/rfc8200) [,](https://www.rfc-editor.org/info/rfc6191) [with Augmented Packet Header Diagrams" Work in Progress Internet-Draft,](https://www.rfc-editor.org/info/rfc2883) [,](https://www.rfc-editor.org/info/rfc2883) , [draft-mcquistin-augmented-ascii-diagrams-10](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [, 7 March 2022,](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [<https://](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10> .

- [Thomson, M.](https://www.rfc-editor.org/info/rfc8201) [and](https://www.rfc-editor.org/info/rfc8201) [T. Pauly "Long-Term Viability of Protocol Extension](https://www.rfc-editor.org/errata/eid2298) [,](https://www.rfc-editor.org/info/rfc6429) [Mechanisms" RFC 9170 DOI 10.17487/RFC9170](https://www.rfc-editor.org/info/rfc791) [,](https://www.rfc-editor.org/info/rfc791) [,](https://www.rfc-editor.org/info/rfc791) , December 2021, <https:// www.rfc-editor.org/info/rfc9170> .

- [Minshall, G. "A Suggested Modification to Nagle's Algorithm" Work in Progress](https://www.rfc-editor.org/info/rfc1191) , [,](https://www.rfc-editor.org/info/rfc1191) , [Internet-Draft, draft-minshall-nagle-01](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) [, 18 June 1999,](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) <https:// datatracker.ietf.org/doc/html/draft-minshall-nagle-01> [.](https://www.rfc-editor.org/info/rfc3465)

- [Dalal, Y.](https://www.rfc-editor.org/info/rfc2119) and [C. Sunshine "Connection Management in Transport Protocols"](https://www.rfc-editor.org/info/rfc8548) [,](https://www.rfc-editor.org/info/rfc8548) , Computer Networks, Vol. 2, No. 6, pp. 454-473 DOI [,](https://www.rfc-editor.org/errata/eid2934) [10.1016/0376-5075(78)90053-3](https://doi.org/10.1016/0376-5075(78)90053-3) [, December 1978,](https://www.rfc-editor.org/info/rfc793) [<[https://doi.org/](https://doi.org/)](https://www.iana.org/assignments/tcp-parameters/) [10.1016/0376-5075(78)90053-3>](https://www.rfc-editor.org/info/rfc4727) [.](https://www.rfc-editor.org/info/rfc8558)

- Faber, T. Touch, J. , , and [W. Yui "The TIME-WAIT state in TCP and Its Effect on](https://www.rfc-editor.org/info/rfc896) [,](https://www.rfc-editor.org/info/rfc896) [Busy Servers" Proceedings of IEEE INFOCOM, pp. 1573-1583 DOI 10.1109/](https://www.rfc-editor.org/rfc/rfc6528#section-3) , [,](https://www.rfc-editor.org/info/rfc4821) [INFCOM.1999.752180](https://doi.org/10.1109/INFCOM.1999.752180) [, March 1999,](https://www.rfc-editor.org/info/rfc1011) [<[https://doi.org/10.1109/INFCOM.](https://doi.org/10.1109/INFCOM.)](https://www.rfc-editor.org/info/rfc2914) 1999.752180> .

- [Postel, J. "Comments on Action Items from the January Meeting" IEN 177](https://www.rfc-editor.org/ien/ien177.txt) , [,](https://www.rfc-editor.org/info/rfc1122) [,](https://www.rfc-editor.org/info/rfc1122) [March 1981,](https://www.rfc-editor.org/info/rfc3168) [<[https://www.rfc-editor.org/ien/ien177.txt](https://www.rfc-editor.org/ien/ien177.txt)>](https://www.rfc-editor.org/info/rfc3168) .

- ["Segmentation Offloads" The Linux Kernel Documentation <https://](https://www.rfc-editor.org/info/rfc7323) [,](https://www.rfc-editor.org/info/rfc7323) [,](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [www.kernel.org/doc/html/latest/networking/segmentation-offloads.html>](https://www.rfc-editor.org/info/rfc1349) [.](https://www.rfc-editor.org/info/rfc5033)

- [RFC Errata Erratum ID 573 RFC 793 <[https://www.rfc-editor.org/errata/eid573](https://www.rfc-editor.org/errata/eid573)>](https://www.rfc-editor.org/info/rfc5044) [,](https://www.rfc-editor.org/info/rfc5044) [,](https://www.rfc-editor.org/info/rfc5044) [,](https://www.rfc-editor.org/info/rfc5044) .

- [RFC Errata Erratum ID 574 RFC 793 <[https://www.rfc-editor.org/errata/eid574](https://www.rfc-editor.org/errata/eid574)>](https://www.rfc-editor.org/info/rfc5681) [,](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.4.2) , , [.](https://www.iana.org/assignments/tcp-parameters/)

- [RFC Errata Erratum ID 700 RFC 793 <[https://www.rfc-editor.org/errata/eid700](https://www.rfc-editor.org/errata/eid700)>](https://www.rfc-editor.org/info/rfc7414) [,](https://www.iana.org/assignments/tcp-parameters/) [,](https://www.iana.org/assignments/tcp-parameters/) [,](https://www.rfc-editor.org/info/rfc7414) .

- [RFC Errata Erratum ID 701 RFC 793 <[https://www.rfc-editor.org/errata/eid701](https://www.rfc-editor.org/errata/eid701)>](https://www.rfc-editor.org/errata/eid1569) , , , [.](https://www.rfc-editor.org/info/rfc5570)

- [RFC Errata Erratum ID 1283 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/)](https://www.rfc-editor.org/info/rfc2018) [,](https://www.rfc-editor.org/info/rfc2018) [,](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [,](https://www.rfc-editor.org/info/rfc2018) [eid1283>](https://www.rfc-editor.org/info/rfc7657) [.](https://www.rfc-editor.org/info/rfc7657)

- RFC Errata Erratum ID 1561 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/) [,](https://www.rfc-editor.org/info/rfc6298) , , [eid1561>](https://www.rfc-editor.org/info/rfc5795) [.](https://www.rfc-editor.org/info/rfc5795)

- [RFC Errata Erratum ID 1562 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/)](https://www.rfc-editor.org/info/rfc6633) [,](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [,](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4) [,](https://www.rfc-editor.org/info/rfc6633) eid1562> [.](https://www.rfc-editor.org/info/rfc9293)

- RFC Errata Erratum ID 1564 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/) , [,](https://www.rfc-editor.org/rfc/rfc793#section-2) [,](https://www.rfc-editor.org/info/rfc8095) [eid1564>](https://www.rfc-editor.org/info/rfc8174) [.](https://www.rfc-editor.org/rfc/rfc5961#section-5)

- RFC Errata Erratum ID 1571 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/) , , , eid1571> .

- [[82]](https://trustee.ietf.org/license-info) [RFC Errata Erratum ID 1572 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/)](https://www.rfc-editor.org/info/rfc5927) [,](https://trustee.ietf.org/license-info) [,](https://trustee.ietf.org/license-info) [,](https://www.rfc-editor.org/info/rfc5927) [eid1572>](https://www.rfc-editor.org/info/rfc8200) [.](https://www.rfc-editor.org/info/rfc8311)

- [RFC Errata Erratum ID 2297 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/)](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [,](https://www.rfc-editor.org/rfc/rfc2873) [,](https://www.rfc-editor.org/rfc/rfc6528) [,](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [eid2297>](https://www.rfc-editor.org/rfc/rfc1011) [.](https://www.rfc-editor.org/rfc/rfc1122)

- RFC Errata Erratum ID 2298 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/) [,](https://www.rfc-editor.org/info/rfc8201) [,](https://www.rfc-editor.org/info/rfc6429) , [eid2298>](https://www.rfc-editor.org/info/rfc9170) [.](https://www.rfc-editor.org/info/rfc791)

- [RFC Errata Erratum ID 2748 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/)](https://www.rfc-editor.org/rfc/rfc8200#section-8.1) , , [,](https://www.rfc-editor.org/info/rfc3449) [eid2748>](https://www.rfc-editor.org/info/rfc8961) .

- RFC Errata Erratum ID 2749 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/) , , , [eid2749>](https://www.rfc-editor.org/info/rfc3465) [.](https://www.rfc-editor.org/info/rfc3465)

- RFC Errata Erratum ID 2934 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/) , , , [eid2934>](https://doi.org/10.1016/0376-5075(78)90053-3) [.](https://doi.org/10.1016/0376-5075(78)90053-3)

- [[88]](https://www.iana.org/assignments/tcp-parameters/) [RFC Errata Erratum ID 3213 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/)](https://www.rfc-editor.org/info/rfc2474) , [,](https://www.rfc-editor.org/info/rfc2474) [,](https://www.rfc-editor.org/info/rfc2474) eid3213> .

- [RFC Errata Erratum ID 3300 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/)](https://www.rfc-editor.org/info/rfc2914) , [,](https://www.rfc-editor.org/info/rfc2914) [,](https://www.rfc-editor.org/info/rfc2914) [eid3300>](https://doi.org/10.1109/INFCOM.1999.752180) [.](https://doi.org/10.1109/INFCOM.1999.752180)

- RFC Errata Erratum ID 3301 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/) , , , [eid3301>](https://www.rfc-editor.org/info/rfc3168) [.](https://www.rfc-editor.org/info/rfc3168)

- [RFC Errata Erratum ID 6222 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/)](https://www.rfc-editor.org/info/rfc7323) [,](https://www.rfc-editor.org/info/rfc7323) [,](https://www.rfc-editor.org/info/rfc7323) [,](https://www.rfc-editor.org/info/rfc7323) [eid6222>](https://www.rfc-editor.org/rfc/rfc5461#section-4) [.](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html)

- [RFC Errata Erratum ID 572 RFC 793 <[https://www.rfc-editor.org/errata/eid572](https://www.rfc-editor.org/errata/eid572)>](https://www.rfc-editor.org/info/rfc5044) [,](https://www.rfc-editor.org/info/rfc5033) [,](https://www.rfc-editor.org/info/rfc5044) [,](https://www.rfc-editor.org/info/rfc5044) .

- [RFC Errata Erratum ID 575 RFC 793 <[https://www.rfc-editor.org/errata/eid575](https://www.rfc-editor.org/errata/eid575)>](https://www.rfc-editor.org/errata/eid574) [,](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.4.2) , , .

- [RFC Errata Erratum ID 1565 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/)](https://www.rfc-editor.org/info/rfc5461) [,](https://www.iana.org/assignments/tcp-parameters/) [,](https://www.rfc-editor.org/info/rfc5461) [,](https://www.rfc-editor.org/info/rfc5461) eid1565> .

- [RFC Errata Erratum ID 1569 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/)](https://www.rfc-editor.org/info/rfc2018) [,](https://www.rfc-editor.org/info/rfc5961) [,](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [,](https://www.rfc-editor.org/info/rfc2018) [eid1569>](https://www.rfc-editor.org/info/rfc5570) [.](https://www.rfc-editor.org/info/rfc5570)

- RFC Errata Erratum ID 2296 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/) , , , [eid2296>](https://www.rfc-editor.org/info/rfc6298) [.](https://www.rfc-editor.org/info/rfc6298)

- [RFC Errata Erratum ID 3305 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/)](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [,](https://www.rfc-editor.org/info/rfc8087) [,](https://www.rfc-editor.org/info/rfc8087) [,](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seq-validation-04) [eid3305>](https://www.rfc-editor.org/errata/eid1562) .

- [[98]](https://www.rfc-editor.org/rfc/rfc8095#section-3.1) RFC Errata Erratum ID 3602 RFC 793 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/) , , , [eid3602>](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [.](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

- RFC Errata Erratum ID 4772 RFC 5961 <[https://www.rfc-editor.org/errata/](https://www.rfc-editor.org/errata/) [,](https://www.rfc-editor.org/rfc/rfc5961#section-5) [,](https://www.rfc-editor.org/info/rfc2873) , [eid4772>](https://www.rfc-editor.org/errata/eid1571) .

- [Gont, F. "ICMP Attacks against TCP" RFC 5927 DOI 10.17487/RFC5927](https://www.rfc-editor.org/info/rfc5927) [,](https://trustee.ietf.org/license-info) [,](https://www.rfc-editor.org/info/rfc5927) [,](https://www.rfc-editor.org/info/rfc6191) [, July 2010,](https://www.rfc-editor.org/info/rfc8200) [<[https://www.rfc-editor.org/info/rfc5927](https://www.rfc-editor.org/info/rfc5927)>](https://www.rfc-editor.org/info/rfc2883) [.](https://www.rfc-editor.org/info/rfc2883)

## [Appendix A.](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) Other Implementation Notes

[This section includes additional notes and references on TCP implementation decisions that are](https://www.rfc-editor.org/info/rfc6429) [currently not a part of the RFC series or included within the TCP standard. These items can be](https://www.rfc-editor.org/info/rfc791) considered by implementers, but there was not yet a consensus to include them in the standard.

### A.1. [IP Security Compartment and Precedence](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

The IPv4 specification [[1]](https://www.rfc-editor.org/info/rfc3465) [includes a precedence value in the (now obsoleted) Type of Service](https://www.rfc-editor.org/info/rfc6691) (TOS) field. It was modified in [20] [and then obsoleted by the definition of Differentiated Services](https://www.rfc-editor.org/info/rfc8548) (Diffserv) [[4]](https://www.rfc-editor.org/rfc/rfc5570#section-7.3.1) . Setting and conveying TOS between the network layer, TCP implementation, and [applications is obsolete and is replaced by Diffserv in the current TCP specification.](https://doi.org/10.1016/0376-5075(78)90053-3)

[RFC 793 required checking the IP security compartment and precedence on incoming TCP](https://www.rfc-editor.org/info/rfc2474) [segments for consistency within a connection and with application requests. Each of these](https://www.rfc-editor.org/info/rfc6994) aspects of IP have become outdated, without specific updates to RFC 793. The issues with precedence were fixed by [[25]](https://doi.org/10.1109/INFCOM.1999.752180) [, which is Standards Track, and so this present TCP specification](https://www.rfc-editor.org/info/rfc2914) [includes those changes. However, the state of IP security options that may be used by Multi-Level](https://www.rfc-editor.org/info/rfc7094) Secure (MLS) systems is not as apparent in the IETF currently.

[Resetting connections when incoming packets do not meet expected security compartment or](https://www.rfc-editor.org/info/rfc3168) [precedence expectations has been recognized as a possible attack vector](https://www.rfc-editor.org/info/rfc7323) [63] , and there has been [discussion about amending the TCP specification to prevent connections from being aborted due](https://www.rfc-editor.org/info/rfc1349) to nonmatching IP security compartment and Diffserv codepoint values.

### A.1.1. Precedence

[In Diffserv, the former precedence values are treated as Class Selector codepoints, and methods](https://www.rfc-editor.org/info/rfc5461) for compatible treatment are described in the Diffserv architecture. The RFC TCP specification defined by RFCs 793 and 1122 included logic intending to have connections use the highest [precedence requested by either endpoint application, and to keep the precedence consistent](https://www.rfc-editor.org/info/rfc5961) [throughout a connection. This logic from the obsolete TOS is not applicable to Diffserv and](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [should not be included in TCP implementations, though changes to Diffserv values within a](https://www.rfc-editor.org/info/rfc7657) connection are discouraged. For discussion of this, see RFC 7657 (Sections 5.1, 5.3, and 6) [[50]](https://www.rfc-editor.org/info/rfc6298) [.](https://www.rfc-editor.org/info/rfc6298)

[The obsoleted TOS processing rules in TCP assumed bidirectional (or symmetric) precedence](https://www.rfc-editor.org/info/rfc5795) [values used on a connection, but the Diffserv architecture is asymmetric. Problems with the old](https://www.rfc-editor.org/info/rfc8087) [TCP logic in this regard were described in](https://www.rfc-editor.org/errata/eid1562) [[25]](https://www.rfc-editor.org/info/rfc9293) [, and the solution described is to ignore IP](https://www.rfc-editor.org/info/rfc6633) precedence in TCP. Since RFC 2873 is a Standards Track document (although not marked as [updating RFC 793), current implementations are expected to be robust in these conditions. Note](https://www.rfc-editor.org/rfc/rfc793#section-2) [that the Diffserv field value used in each direction is a part of the interface between TCP and the](https://www.rfc-editor.org/info/rfc2873) network layer, and values in use can be indicated both ways between TCP and the application.

### A.1.2. MLS Systems

[The IP Security Option (IPSO) and compartment defined in](https://www.rfc-editor.org/rfc/rfc2873) [[1]](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) [was refined in RFC 1038, which](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) was later obsoleted by RFC 1108. The Commercial IP Security Option (CIPSO) is defined in [FIPS-188 (withdrawn by NIST in 2015) and is supported by some vendors and operating systems.](https://www.rfc-editor.org/info/rfc2923) [RFC 1108 is now Historic, though RFC 791 itself has not been updated to remove the IP Security](https://www.rfc-editor.org/info/rfc6429) [Option. For IPv6, a similar option (Common Architecture Label IPv6 Security Option (CALIPSO))](https://www.rfc-editor.org/info/rfc791) has been defined [36] [. RFC 793 includes logic that includes the IP security/compartment](https://www.rfc-editor.org/info/rfc3449) [information in treatment of TCP segments. References to the IP "security/compartment" in this](https://www.rfc-editor.org/info/rfc1191) [document may be relevant for Multi-Level Secure (MLS) system implementers but can be ignored](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) for non-MLS implementations, consistent with running code on the Internet. See Appendix A.1 for further discussion. Note that RFC 5570 describes some MLS networking scenarios where [IPSO, CIPSO, or CALIPSO may be used. In these special cases, TCP implementers should see](https://www.rfc-editor.org/info/rfc8548) Section 7.3.1 of RFC 5570 and follow the guidance in that document.

### A.2. Sequence Number Validation

[There are cases where the TCP sequence number validation rules can prevent ACK fields from](https://www.rfc-editor.org/rfc/rfc6528#section-3) being processed. This can result in connection issues, as described in [[64]](https://www.rfc-editor.org/info/rfc2914) [, which includes](https://www.rfc-editor.org/info/rfc2914) [descriptions of potential problems in conditions of simultaneous open, self-connects,](https://www.rfc-editor.org/info/rfc1011) [simultaneous close, and simultaneous window probes. The document also describes potential](https://www.rfc-editor.org/info/rfc7094) [changes to the TCP specification to mitigate the issue by expanding the acceptable sequence](https://www.rfc-editor.org/ien/ien177.txt) numbers.

[In Internet usage of TCP, these conditions rarely occur. Common operating systems include](https://www.rfc-editor.org/info/rfc7323) different alternative mitigations, and the standard has not been updated yet to codify one of [them, but implementers should consider the problems described in](https://www.rfc-editor.org/info/rfc5044) [[64]](https://www.rfc-editor.org/info/rfc7413) [.](https://www.rfc-editor.org/info/rfc7413)

### A.3. [Nagle Modification](https://www.rfc-editor.org/info/rfc1644)

In common operating systems, both the Nagle algorithm and delayed acknowledgments are implemented and enabled by default. TCP is used by many applications that have a request- [response style of communication, where the combination of the Nagle algorithm and delayed](https://www.rfc-editor.org/info/rfc5961) [acknowledgments can result in poor application performance. A modification to the Nagle](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) algorithm is described in [[68]](https://www.rfc-editor.org/info/rfc7657) that improves the situation for these applications.

This modification is implemented in some common operating systems and does not impact TCP [interoperability. Additionally, many applications simply disable Nagle since this is generally](https://www.rfc-editor.org/info/rfc5795) [supported by a socket option. The TCP standard has not been updated to include this Nagle](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4) [modification, but implementers may find it beneficial to consider.](https://www.rfc-editor.org/info/rfc9293)

### A.4. [Low Watermark Settings](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

[Some operating system kernel TCP implementations include socket options that allow specifying](https://www.rfc-editor.org/info/rfc2873) the number of bytes in the buffer until the socket layer will pass sent data to TCP [(SO_SNDLOWAT) or to the application on receiving (SO_RCVLOWAT).](https://www.rfc-editor.org/info/rfc8303)

[In addition, another socket option (TCP_NOTSENT_LOWAT) can be used to control the amount of](https://www.rfc-editor.org/info/rfc5927) [unsent bytes in the write queue. This can help a sending TCP application to avoid creating large](https://www.rfc-editor.org/info/rfc2883) [amounts of buffered data (and corresponding latency). As an example, this may be useful for](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) applications that are multiplexing data from multiple upper-level streams onto a connection, especially when streams may be a mix of interactive/real-time and bulk data transfer.

## Appendix B. TCP Requirement Summary

[This section is adapted from RFC 1122.](https://www.rfc-editor.org/info/rfc8961)

[Note that there is no requirement related to PLPMTUD in this list, but that PLPMTUD is](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01) recommended.

### [Feature](https://www.rfc-editor.org/errata/eid2934) ReqID [MUST](https://www.rfc-editor.org/info/rfc793) [SHOULD](https://www.rfc-editor.org/info/rfc793) [MAY](https://www.rfc-editor.org/info/rfc793) [SHOULD](https://www.rfc-editor.org/info/rfc793) MUST

## [NOT](https://www.iana.org/assignments/tcp-parameters/) [NOT](https://www.iana.org/assignments/tcp-parameters/)

### PUSH flag

Aggregate or queue un-pushed MAY-16 [X](https://www.rfc-editor.org/info/rfc4821) data

Sender collapse successive PSH SHLD-27 [X](https://www.rfc-editor.org/errata/eid3301) bits

SEND call can specify PUSH [MAY-15](https://www.rfc-editor.org/info/rfc7323) X

- If cannot: sender buffer MUST-60 [X](https://www.rfc-editor.org/info/rfc5033) indefinitely

- [If cannot: PSH last segment](https://www.rfc-editor.org/info/rfc1644) [MUST-61](https://www.rfc-editor.org/info/rfc5461) [X](https://www.rfc-editor.org/info/rfc5461)

Notify receiving ALP 1 [of PSH](https://www.rfc-editor.org/info/rfc5961) MAY-17 [X](https://www.rfc-editor.org/errata/eid1569)

Send max size segment when [SHLD-28](https://www.rfc-editor.org/info/rfc7657) [X](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) possible

### Window

Treat as unsigned number [MUST-1](https://www.rfc-editor.org/rfc/rfc1122#section-3.3.1.4) [X](https://www.rfc-editor.org/info/rfc6633)

Handle as 32-bit number REC-1 [X](https://www.rfc-editor.org/errata/eid1564)

Shrink window from right [SHLD-14](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [X](https://www.rfc-editor.org/info/rfc6093)

### [Feature](https://trustee.ietf.org/license-info) [ReqID](https://trustee.ietf.org/license-info) [MUST](https://www.rfc-editor.org/info/rfc5927) [SHOULD](https://www.rfc-editor.org/info/rfc6191) [MAY](https://www.rfc-editor.org/info/rfc8200) [SHOULD](https://www.rfc-editor.org/rfc/rfc1122#section-4.2.2.2) [MUST](https://www.rfc-editor.org/info/rfc8200)

## [NOT](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) NOT

- [•](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [Send new data when](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) SHLD-15 X window shrinks

- Retransmit old unacked SHLD-16 [X](https://www.rfc-editor.org/errata/eid2748) data within window

- [Time out conn for data past](https://www.rfc-editor.org/errata/eid2749) SHLD-17 [X](https://www.rfc-editor.org/info/rfc3465) right edge

Robust against shrinking [MUST-34](https://doi.org/10.1016/0376-5075(78)90053-3) [X](https://www.rfc-editor.org/info/rfc793) [window](https://www.iana.org/assignments/tcp-parameters/)

Receiver's window closed MAY-8 [X](https://www.rfc-editor.org/info/rfc896) indefinitely

Use standard probing logic MUST-35 X

Sender probe zero window [MUST-36](https://www.rfc-editor.org/ien/ien177.txt) [X](https://www.rfc-editor.org/ien/ien177.txt)

- First probe after RTO [SHLD-29](https://www.rfc-editor.org/info/rfc4953) [X](https://www.rfc-editor.org/info/rfc4953)

- Exponential backoff SHLD-30 [X](https://www.rfc-editor.org/errata/eid573)

Allow window stay zero MUST-37 X indefinitely

Retransmit old data beyond MAY-7 [X](https://www.rfc-editor.org/errata/eid1569) SND.UNA+SND.WND

[Process RST and URG even with](https://www.rfc-editor.org/info/rfc7657) [MUST-66](https://www.rfc-editor.org/info/rfc7657) X zero window

### Urgent Data

Include support for urgent [MUST-30](https://www.rfc-editor.org/info/rfc9293) [X](https://www.rfc-editor.org/info/rfc9293) [pointer](https://www.rfc-editor.org/rfc/rfc8095#section-3.1)

Pointer indicates first non- [MUST-62](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [X](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) urgent octet

## [MUST-31](https://www.rfc-editor.org/info/rfc8303) [X](https://www.rfc-editor.org/info/rfc8303)

### [Feature](https://trustee.ietf.org/license-info) [ReqID](https://trustee.ietf.org/license-info) [MUST](https://www.rfc-editor.org/info/rfc5927) [SHOULD](https://www.rfc-editor.org/info/rfc6191) [MAY](https://www.rfc-editor.org/info/rfc8200) [SHOULD](https://www.rfc-editor.org/rfc/rfc1122#section-4.2.2.2) [MUST](https://www.rfc-editor.org/info/rfc8200)

## [NOT](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) NOT

Arbitrary length urgent data sequence

[Inform ALP](mailto:wes@mti-systems.com) 1 [asynchronously of](https://www.rfc-editor.org/info/rfc791) [MUST-32](https://www.rfc-editor.org/info/rfc791) [X](https://www.rfc-editor.org/info/rfc791)

urgent data

ALP 1 [can learn if/how much](https://www.rfc-editor.org/rfc/rfc7657#section-5.1) MUST-33 [X](https://www.rfc-editor.org/info/rfc1191)

urgent data Q'd

ALP employ the urgent [SHLD-13](https://www.rfc-editor.org/info/rfc8548) [X](https://www.rfc-editor.org/info/rfc2119) mechanism

### TCP Options

[Support the mandatory option](https://www.rfc-editor.org/errata/eid3213) MUST-4 [X](https://www.rfc-editor.org/info/rfc2474) set

Receive TCP Option in any [MUST-5](https://www.rfc-editor.org/info/rfc1011) [X](https://www.rfc-editor.org/info/rfc1011) segment

Ignore unsupported options [MUST-6](https://www.rfc-editor.org/info/rfc3168) [X](https://www.rfc-editor.org/info/rfc3168)

Include length for all options [MUST-68](https://www.rfc-editor.org/info/rfc7323) [X](https://www.rfc-editor.org/info/rfc7323) except EOL+NOP

[Cope with illegal option length](https://www.rfc-editor.org/info/rfc9065) [MUST-7](https://www.rfc-editor.org/info/rfc5044) [X](https://www.rfc-editor.org/info/rfc5044)

Process options regardless of [MUST-64](https://www.rfc-editor.org/info/rfc5461) [X](https://www.rfc-editor.org/info/rfc5461) word alignment

Implement sending & receiving MUST-14 X MSS Option

IPv4 Send MSS Option unless [SHLD-5](https://www.rfc-editor.org/info/rfc7657) [X](https://www.rfc-editor.org/errata/eid2296) 536

IPv6 Send MSS Option unless [SHLD-5](https://www.rfc-editor.org/info/rfc8087) [X](https://www.rfc-editor.org/errata/eid1562) 1220

Send MSS Option always MAY-3 [X](https://www.rfc-editor.org/errata/eid1564)

IPv4 Send-MSS default is 536 [MUST-15](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [X](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

IPv6 Send-MSS default is 1220 MUST-15 X

### [Feature](https://trustee.ietf.org/license-info) [ReqID](https://trustee.ietf.org/license-info) [MUST](https://www.rfc-editor.org/info/rfc5927) [SHOULD](https://www.rfc-editor.org/info/rfc6191) [MAY](https://www.rfc-editor.org/info/rfc8200) [SHOULD](https://www.rfc-editor.org/rfc/rfc1122#section-4.2.2.2) [MUST](https://www.rfc-editor.org/info/rfc8200)

## [NOT](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) NOT

[Calculate effective send seg size](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) MUST-16 X

[MSS accounts for varying MTU](https://www.rfc-editor.org/info/rfc8201) [SHLD-6](https://www.rfc-editor.org/info/rfc6429) [X](https://www.rfc-editor.org/errata/eid2298)

MSS not sent on non-SYN MUST-65 X segments

MSS value based on MMS_R [MUST-67](https://www.rfc-editor.org/rfc/rfc1122#section-3.4) [X](https://datatracker.ietf.org/doc/html/draft-minshall-nagle-01)

Pad with zero MUST-69 [X](https://www.rfc-editor.org/info/rfc6691)

### [TCP Checksums](https://www.rfc-editor.org/rfc/rfc5570#section-7.3.1)

[Sender compute checksum](https://www.iana.org/assignments/tcp-parameters/) [MUST-2](https://www.rfc-editor.org/info/rfc8558) [X](https://www.rfc-editor.org/info/rfc8558)

Receiver check checksum MUST-3 [X](https://www.rfc-editor.org/info/rfc6994)

### ISN Selection

Include a clock-driven ISN [MUST-8](https://www.rfc-editor.org/info/rfc7094) [X](https://www.rfc-editor.org/info/rfc4987) generator component

Secure ISN generator with a [SHLD-1](https://www.rfc-editor.org/info/rfc7323) [X](https://www.rfc-editor.org/errata/eid6222) PRF component

PRF computable from outside [MUST-9](https://www.rfc-editor.org/info/rfc5044) [X](https://www.rfc-editor.org/errata/eid573) the host

### Opening Connections

Support simultaneous open MUST-10 X attempts

[SYN-RECEIVED remembers last](https://www.rfc-editor.org/info/rfc7657) [MUST-11](https://www.rfc-editor.org/info/rfc7657) [X](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) state

Passive OPEN call interfere [MUST-41](https://www.rfc-editor.org/info/rfc5795) X with others

Function: simultaneously [MUST-42](https://www.rfc-editor.org/info/rfc9293) [X](https://www.rfc-editor.org/info/rfc9293) LISTENs for same port

[Ask IP for src address for SYN if](https://www.rfc-editor.org/info/rfc8174) [MUST-44](https://www.rfc-editor.org/info/rfc2873) X necessary

## [MUST-45](https://www.rfc-editor.org/info/rfc8303) [X](https://www.rfc-editor.org/info/rfc8303)

### [Feature](https://trustee.ietf.org/license-info) [ReqID](https://trustee.ietf.org/license-info) [MUST](https://www.rfc-editor.org/info/rfc5927) [SHOULD](https://www.rfc-editor.org/info/rfc6191) [MAY](https://www.rfc-editor.org/info/rfc8200) [SHOULD](https://www.rfc-editor.org/rfc/rfc1122#section-4.2.2.2) [MUST](https://www.rfc-editor.org/info/rfc8200)

## [NOT](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) NOT

- [•](https://www.rfc-editor.org/rfc/rfc8303#section-3.1) [Otherwise, use local addr](https://www.rfc-editor.org/rfc/rfc793) [of connection](https://www.rfc-editor.org/rfc/rfc2525#section-2.17)

[OPEN to broadcast/multicast IP](https://www.rfc-editor.org/info/rfc9170) [MUST-46](https://www.rfc-editor.org/info/rfc791) X address

Silently discard seg to bcast/ [MUST-57](https://www.rfc-editor.org/rfc/rfc1122#section-3.4) [X](https://www.rfc-editor.org/info/rfc1191) mcast addr

### Closing Connections

RST can contain data [SHLD-2](https://doi.org/10.1016/0376-5075(78)90053-3) [X](https://www.iana.org/assignments/tcp-parameters/)

Inform application of aborted MUST-12 [X](https://www.rfc-editor.org/info/rfc2474) conn

Half-duplex close connections [MAY-1](https://www.rfc-editor.org/info/rfc1011) [X](https://www.rfc-editor.org/info/rfc2914)

- [Send RST to indicate data](https://www.rfc-editor.org/info/rfc7094) [SHLD-3](https://www.rfc-editor.org/info/rfc7094) [X](https://www.rfc-editor.org/info/rfc4987) lost

In TIME-WAIT state for 2MSL [MUST-13](https://www.rfc-editor.org/info/rfc7323) [X](https://www.rfc-editor.org/info/rfc7323) seconds

- [Accept SYN from TIME-](https://www.rfc-editor.org/info/rfc9065) [MAY-2](https://www.rfc-editor.org/info/rfc5044) [X](https://www.rfc-editor.org/info/rfc7413) WAIT state

- [Use Timestamps to reduce](https://www.rfc-editor.org/errata/eid1565) SHLD-4 [X](https://www.rfc-editor.org/info/rfc7414) TIME-WAIT

### Retransmissions

[Implement exponential backoff,](https://www.rfc-editor.org/info/rfc6298) MUST-19 [X](https://www.rfc-editor.org/info/rfc2525) slow start, and congestion avoidance

Retransmit with same IP [MAY-4](https://www.rfc-editor.org/info/rfc9293) [X](https://www.rfc-editor.org/info/rfc5925) identity

Karn's algorithm [MUST-18](https://www.rfc-editor.org/info/rfc2873) X

### Generating ACKs

### [Feature](https://trustee.ietf.org/license-info) [ReqID](https://trustee.ietf.org/license-info) [MUST](https://www.rfc-editor.org/info/rfc5927) [SHOULD](https://www.rfc-editor.org/info/rfc6191) [MAY](https://www.rfc-editor.org/info/rfc8200) [SHOULD](https://www.rfc-editor.org/rfc/rfc1122#section-4.2.2.2) [MUST](https://www.rfc-editor.org/info/rfc8200)

## [NOT](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) NOT

[Aggregate whenever possible](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) MUST-58 X

Queue out-of-order segments [SHLD-31](https://www.rfc-editor.org/info/rfc6429) [X](https://www.rfc-editor.org/errata/eid2298)

Process all Q'd before send ACK MUST-59 X

Send ACK for out-of-order MAY-13 [X](https://www.rfc-editor.org/info/rfc1191) segment

Delayed ACKs SHLD-18 [X](https://www.rfc-editor.org/info/rfc6691)

- Delay < 0.5 seconds MUST-40 [X](https://www.rfc-editor.org/info/rfc793)

- Every 2nd full-sized SHLD-19 [X](https://www.rfc-editor.org/info/rfc2474) segment or 2*RMSS ACK'd

Receiver SWS-Avoidance MUST-39 X Algorithm

### Sending Data

Configurable TTL [MUST-49](https://www.rfc-editor.org/info/rfc7323) [X](https://www.rfc-editor.org/info/rfc7323)

Sender SWS-Avoidance MUST-38 X Algorithm

Nagle algorithm [SHLD-7](https://www.rfc-editor.org/info/rfc5461) [X](https://www.rfc-editor.org/info/rfc5681)

- Application can disable MUST-17 X Nagle algorithm

### Connection Failures

Negative advice to IP on R1 [MUST-20](https://www.rfc-editor.org/info/rfc5795) [X](https://www.rfc-editor.org/info/rfc2525) retransmissions

Close connection on R2 [MUST-20](https://www.rfc-editor.org/info/rfc9293) [X](https://www.rfc-editor.org/info/rfc9293) [retransmissions](https://www.rfc-editor.org/rfc/rfc8095#section-3.1)

ALP 1 can set R2 [MUST-21](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [X](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12)

Inform ALP of R1<=retxs<R2 SHLD-9 X

### [Feature](https://trustee.ietf.org/license-info) [ReqID](https://trustee.ietf.org/license-info) [MUST](https://www.rfc-editor.org/info/rfc5927) [SHOULD](https://www.rfc-editor.org/info/rfc6191) [MAY](https://www.rfc-editor.org/info/rfc8200) [SHOULD](https://www.rfc-editor.org/rfc/rfc1122#section-4.2.2.2) [MUST](https://www.rfc-editor.org/info/rfc8200)

## [NOT](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) NOT

[Recommended value for R1](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) SHLD-10 X

Recommended value for R2 [SHLD-11](https://www.rfc-editor.org/info/rfc6429) [X](https://www.rfc-editor.org/errata/eid2298)

Same mechanism for SYNs MUST-22 X

- [R2 at least 3 minutes for](https://www.rfc-editor.org/info/rfc8961) MUST-23 [X](https://www.rfc-editor.org/info/rfc1191) SYN

### Send Keep-alive Packets

Send Keep-alive Packets: [MAY-5](https://doi.org/10.1016/0376-5075(78)90053-3) [X](https://www.iana.org/assignments/tcp-parameters/)

- [Application can request](https://www.rfc-editor.org/errata/eid3213) MUST-24 [X](https://www.rfc-editor.org/info/rfc2474)

- Default is "off" [MUST-25](https://www.rfc-editor.org/info/rfc8684) [X](https://www.rfc-editor.org/info/rfc2914)

- Only send if idle for MUST-26 X interval

- [Interval configurable](https://www.rfc-editor.org/rfc/rfc5461#section-4) [MUST-27](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) [X](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html)

- Default at least 2 hrs. MUST-28 X

- Tolerant of lost ACKs [MUST-29](https://www.iana.org/assignments/tcp-parameters/) X

- Send with no data [SHLD-12](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [X](https://www.rfc-editor.org/errata/eid1283)

- Configurable to send MAY-6 [X](https://www.rfc-editor.org/info/rfc6298) garbage octet

### IP Options

Ignore options TCP doesn't [MUST-50](https://www.rfc-editor.org/rfc/rfc793#section-2) X understand

Timestamp support MAY-10 [X](https://www.rfc-editor.org/errata/eid1571)

Record Route support [MAY-11](https://www.rfc-editor.org/info/rfc8303) [X](https://www.rfc-editor.org/info/rfc8303)

### [Feature](https://trustee.ietf.org/license-info) [ReqID](https://trustee.ietf.org/license-info) [MUST](https://www.rfc-editor.org/info/rfc5927) [SHOULD](https://www.rfc-editor.org/info/rfc6191) [MAY](https://www.rfc-editor.org/info/rfc8200) [SHOULD](https://www.rfc-editor.org/rfc/rfc1122#section-4.2.2.2) [MUST](https://www.rfc-editor.org/info/rfc8200)

## [NOT](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) NOT

[Source Route:](https://www.rfc-editor.org/rfc/rfc8303#section-3.1)

- ALP 1 [can specify](https://www.rfc-editor.org/info/rfc8201) [MUST-51](https://www.rfc-editor.org/info/rfc6429) X

- [Overrides src route in](https://www.rfc-editor.org/errata/eid2748) MUST-52 [X](https://www.rfc-editor.org/rfc/rfc8200#section-8.1) datagram

- [Build return route from src](https://www.rfc-editor.org/info/rfc3465) MUST-53 [X](https://www.rfc-editor.org/info/rfc6691) [route](https://www.rfc-editor.org/rfc/rfc5570#section-7.3.1)

- [•](https://www.iana.org/assignments/tcp-parameters/) [Later src route overrides](https://www.rfc-editor.org/info/rfc4727) [SHLD-24](https://www.rfc-editor.org/info/rfc8558) [X](https://www.rfc-editor.org/info/rfc8558)

### Receiving ICMP Messages from IP

[Receiving ICMP messages from](https://doi.org/10.1109/INFCOM.1999.752180) [MUST-54](https://www.rfc-editor.org/info/rfc1011) [X](https://www.rfc-editor.org/info/rfc1011) IP

- [Dest Unreach (0,1,5) =>](https://www.rfc-editor.org/info/rfc1122) [SHLD-25](https://www.rfc-editor.org/info/rfc3168) [X](https://www.rfc-editor.org/info/rfc3168) inform ALP

- [Abort on Dest Unreach](https://www.rfc-editor.org/info/rfc5033) MUST-56 [X](https://www.rfc-editor.org/errata/eid573) (0,1,5)

- [Dest Unreach (2-4) => abort](https://www.rfc-editor.org/info/rfc1644) [SHLD-26](https://www.rfc-editor.org/info/rfc5461) [X](https://www.rfc-editor.org/info/rfc5461) conn

- [Source Quench => silent](https://www.rfc-editor.org/info/rfc5570) [MUST-55](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [X](https://www.rfc-editor.org/info/rfc2018) discard

- [Abort on Time Exceeded](https://www.rfc-editor.org/info/rfc5795) [MUST-56](https://www.rfc-editor.org/info/rfc5795) X

- [Abort on Param Problem](https://www.rfc-editor.org/errata/eid1562) [MUST-56](https://www.rfc-editor.org/info/rfc9293) X

### Address Validation

Reject OPEN call to invalid IP MUST-46 X address

### [Feature](https://trustee.ietf.org/license-info) [ReqID](https://trustee.ietf.org/license-info) [MUST](https://www.rfc-editor.org/info/rfc5927) [SHOULD](https://www.rfc-editor.org/info/rfc6191) [MAY](https://www.rfc-editor.org/info/rfc8200) [SHOULD](https://www.rfc-editor.org/rfc/rfc1122#section-4.2.2.2) [MUST](https://www.rfc-editor.org/info/rfc8200)

## [NOT](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) NOT

[Reject SYN from invalid IP](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) MUST-63 X address

[Silently discard SYN to bcast/](mailto:wes@mti-systems.com) [MUST-57](https://www.rfc-editor.org/info/rfc791) [X](https://www.rfc-editor.org/info/rfc791) mcast addr

### TCP/ALP Interface Services

Error Report mechanism MUST-47 X

ALP can disable Error Report [SHLD-20](https://www.rfc-editor.org/info/rfc8548) [X](https://www.rfc-editor.org/info/rfc8548) Routine

ALP can specify Diffserv field [MUST-48](https://www.rfc-editor.org/info/rfc8558) [X](https://www.rfc-editor.org/info/rfc8558) for sending

- Passed unchanged to IP [SHLD-22](https://www.rfc-editor.org/info/rfc8684) [X](https://www.rfc-editor.org/info/rfc8684)

ALP can change Diffserv field SHLD-21 [X](https://www.rfc-editor.org/errata/eid3301) during connection

ALP generally changing [SHLD-23](https://www.rfc-editor.org/info/rfc7323) [X](https://www.kernel.org/doc/html/latest/networking/segmentation-offloads.html) Diffserv during conn.

[Pass received Diffserv field up](https://www.rfc-editor.org/info/rfc5033) [MAY-9](https://www.rfc-editor.org/info/rfc5044) [X](https://www.rfc-editor.org/info/rfc7413) to ALP

FLUSH call [MAY-14](https://www.rfc-editor.org/info/rfc5461) [X](https://www.rfc-editor.org/info/rfc5461)

Optional local IP addr param in MUST-43 X OPEN

### RFC 5961 Support

Implement data injection MAY-12 X protection

### [Explicit Congestion Notification](https://www.rfc-editor.org/errata/eid1562)

Support ECN [SHLD-8](https://www.rfc-editor.org/rfc/rfc793#section-2) [X](https://www.rfc-editor.org/errata/eid1564)

### [Alternative Congestion Control](https://www.rfc-editor.org/info/rfc8174)

### [Feature](https://trustee.ietf.org/license-info) [ReqID](https://trustee.ietf.org/license-info) [MUST](https://www.rfc-editor.org/info/rfc5927) [SHOULD](https://www.rfc-editor.org/info/rfc6191) [MAY](https://www.rfc-editor.org/info/rfc8200) [SHOULD](https://www.rfc-editor.org/rfc/rfc1122#section-4.2.2.2) [MUST](https://www.rfc-editor.org/info/rfc8200)

## [NOT](https://datatracker.ietf.org/doc/html/draft-mcquistin-augmented-ascii-diagrams-10) NOT

[Implement alternative](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) MAY-18 X conformant algorithm(s)

### [Table 8: TCP Requirements Summary](https://www.rfc-editor.org/info/rfc9170)

FOOTNOTES: (1) "ALP" means Application-Layer Program.

## Acknowledgments

[This document is largely a revision of RFC 793, of which](https://www.rfc-editor.org/info/rfc3465) [Jon Postel](https://www.rfc-editor.org/info/rfc6691) [was the editor. Due to his](https://www.rfc-editor.org/info/rfc2119) [excellent work, it was able to last for three decades before we felt the need to revise it.](https://www.rfc-editor.org/info/rfc8548)

Andre Oppermann [was a contributor and helped to edit the first revision of this document.](https://www.rfc-editor.org/info/rfc8558)

[We are thankful for the assistance of the IETF TCPM working group chairs over the course of](https://www.rfc-editor.org/info/rfc2474) work on this document:

### Michael Scharf

### Yoshifumi Nishida

### Pasi Sarolahti

### Michael Tüxen

[During the discussions of this work on the TCPM mailing list, in working group meetings, and via](https://www.rfc-editor.org/info/rfc5044) area reviews, helpful comments, critiques, and reviews were received from (listed alphabetically by last name): [Praveen Balasubramanian David Borman Mohamed Boucadair Bob Briscoe Neal](https://www.rfc-editor.org/info/rfc5681) , [,](https://www.rfc-editor.org/info/rfc5681) [,](https://www.rfc-editor.org/info/rfc5681) [,](https://www.rfc-editor.org/info/rfc5681) [Cardwell Yuchung Cheng Martin Duke Francis Dupont Ted Faber Gorry Fairhurst Fernando](https://www.rfc-editor.org/info/rfc5461) , [,](https://www.iana.org/assignments/tcp-parameters/) [,](https://www.rfc-editor.org/info/rfc5461) [,](https://www.rfc-editor.org/info/rfc5461) [,](https://www.rfc-editor.org/info/rfc5461) [,](https://www.rfc-editor.org/errata/eid700) Gont Rodney Grimes Yi Huang Rahul Jadhav Markku Kojo Mike Kosek Juhamatti Kuusisaari , [,](https://www.rfc-editor.org/errata/eid1565) , , [,](https://www.rfc-editor.org/info/rfc7414) [,](https://www.rfc-editor.org/info/rfc7414) , Kevin Lahey Kevin Mason Matt Mathis Stephen McQuistin Jonathan Morton Matt Olson , , , [,](https://www.rfc-editor.org/errata/eid701) [,](https://www.rfc-editor.org/errata/eid701) [,](https://www.rfc-editor.org/errata/eid701) [Tommy Pauly Tom Petch Hagen Paul Pfeifer Kyle Rose Anthony Sabatini Michael Scharf Greg](https://www.rfc-editor.org/info/rfc5961) , [,](https://www.rfc-editor.org/info/rfc5961) [,](https://www.rfc-editor.org/rfc/rfc1122#section-3.2.1.3) [,](https://www.rfc-editor.org/info/rfc2018) [,](https://www.rfc-editor.org/errata/eid1283) [,](https://www.rfc-editor.org/info/rfc5570) [Skinner Joe Touch Michael Tüxen Reji Varghese Bernie Volz Tim Wicinski Lloyd Wood](https://www.rfc-editor.org/info/rfc5570) , [,](https://www.rfc-editor.org/info/rfc5570) [,](https://www.rfc-editor.org/info/rfc5570) [,](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) [,](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) [,](https://datatracker.ietf.org/doc/html/draft-gont-tcpm-tcp-seccomp-prec-00) [, and](https://www.rfc-editor.org/info/rfc7657) Alex Zimmermann [.](https://www.rfc-editor.org/info/rfc7657)

Joe Touch [provided additional help in clarifying the description of segment size parameters and](https://www.rfc-editor.org/info/rfc2525) [PMTUD/PLPMTUD recommendations. Markku Kojo helped put together the text in the section on](https://www.rfc-editor.org/info/rfc8087) TCP Congestion Control.

This document includes content from errata that were reported by (listed chronologically): Yin [Shuming Bob Braden Morris M. Keesan Pei-chun Cheng Constantin Hagemeier Vishwas](https://www.rfc-editor.org/rfc/rfc793#section-2) , [,](https://www.rfc-editor.org/errata/eid1564) [,](https://www.rfc-editor.org/rfc/rfc793#section-2) [,](https://www.rfc-editor.org/info/rfc8095) [,](https://www.rfc-editor.org/info/rfc8174) [Manral Mykyta Yevstifeyev EungJun Yi Botong Huang Charles Deng Merlin Buge](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) , [,](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [,](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [,](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [,](https://datatracker.ietf.org/doc/html/draft-ietf-tcpm-tcp-edo-12) [.](https://www.rfc-editor.org/info/rfc2873)

## Author's Address

[Wesley M. Eddy (](https://www.rfc-editor.org/rfc/rfc2525#section-2.17) [editor](https://www.rfc-editor.org/rfc/rfc1011) [)](https://www.rfc-editor.org/rfc/rfc1122) MTI Systems [United States of America](mailto:wes@mti-systems.com) Email: wes@mti-systems.com