-- phpMyAdmin SQL Dump
-- version 5.1.0-rc1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 18. Mrz 2022 um 15:47
-- Server-Version: 10.5.15-MariaDB-1:10.5.15+maria~bullseye
-- PHP-Version: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `frankenbot`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bans`
--

CREATE TABLE `bans` (
  `id` int(200) NOT NULL,
  `serverid` varchar(200) NOT NULL,
  `uuid` varchar(200) NOT NULL,
  `duration` varchar(200) NOT NULL,
  `punid` varchar(200) NOT NULL,
  `state` varchar(200) NOT NULL DEFAULT 'active',
  `channel` varchar(200) NOT NULL,
  `operator` varchar(200) NOT NULL,
  `username` varchar(200) NOT NULL,
  `reason` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `blacklist`
--

CREATE TABLE `blacklist` (
  `id` int(11) NOT NULL,
  `serverid` varchar(200) NOT NULL,
  `word` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `history`
--

CREATE TABLE `history` (
  `id` int(200) NOT NULL,
  `serverid` varchar(200) NOT NULL,
  `uuid` varchar(200) NOT NULL,
  `punishment` mediumtext NOT NULL,
  `punid` varchar(200) NOT NULL,
  `reason` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `kick`
--

CREATE TABLE `kick` (
  `id` mediumint(9) NOT NULL,
  `serverid` varchar(200) NOT NULL,
  `uuid` varchar(200) NOT NULL,
  `punid` varchar(200) NOT NULL,
  `channel` varchar(200) NOT NULL,
  `operator` varchar(200) NOT NULL,
  `username` varchar(200) NOT NULL,
  `reason` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mutes`
--

CREATE TABLE `mutes` (
  `id` int(200) NOT NULL,
  `serverid` varchar(200) NOT NULL,
  `uuid` varchar(200) NOT NULL,
  `duration` varchar(200) NOT NULL,
  `punid` varchar(200) NOT NULL,
  `state` varchar(200) NOT NULL DEFAULT 'active',
  `channel` varchar(200) NOT NULL,
  `operator` varchar(200) NOT NULL,
  `username` varchar(200) NOT NULL,
  `reason` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `punish`
--

CREATE TABLE `punish` (
  `id` int(11) NOT NULL,
  `warnmnt` varchar(200) NOT NULL,
  `serverid` varchar(200) NOT NULL,
  `punishment` varchar(200) NOT NULL,
  `length` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rewards`
--

CREATE TABLE `rewards` (
  `id` int(7) NOT NULL,
  `serverid` varchar(99) NOT NULL,
  `level` int(9) NOT NULL,
  `rank` blob DEFAULT NULL,
  `rankID` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `settings`
--

CREATE TABLE `settings` (
  `id` int(10) NOT NULL,
  `spam` varchar(200) NOT NULL,
  `incedents` varchar(200) NOT NULL,
  `admincommands` varchar(200) NOT NULL,
  `warnMessage` varchar(200) NOT NULL,
  `noSpam` varchar(200) NOT NULL,
  `serverName` varchar(200) NOT NULL,
  `serverID` varchar(200) NOT NULL,
  `prefix` varchar(200) NOT NULL,
  `can_gain_xp` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `stats`
--

CREATE TABLE `stats` (
  `id` int(10) NOT NULL,
  `warns` int(10) NOT NULL,
  `level` int(10) NOT NULL,
  `xp` int(10) NOT NULL,
  `msgs` int(10) NOT NULL,
  `username` blob NOT NULL,
  `serverid` varchar(200) NOT NULL,
  `uuid` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `warns`
--

CREATE TABLE `warns` (
  `id` int(10) NOT NULL,
  `serverid` varchar(200) NOT NULL,
  `uuid` varchar(200) NOT NULL,
  `duration` varchar(200) NOT NULL,
  `punid` varchar(200) NOT NULL,
  `state` varchar(200) NOT NULL DEFAULT 'active',
  `channel` varchar(200) NOT NULL,
  `operator` varchar(200) NOT NULL,
  `username` varchar(200) NOT NULL,
  `reason` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `bans`
--
ALTER TABLE `bans`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `blacklist`
--
ALTER TABLE `blacklist`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `kick`
--
ALTER TABLE `kick`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `mutes`
--
ALTER TABLE `mutes`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `punish`
--
ALTER TABLE `punish`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `warns`
--
ALTER TABLE `warns`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `bans`
--
ALTER TABLE `bans`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `blacklist`
--
ALTER TABLE `blacklist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT für Tabelle `history`
--
ALTER TABLE `history`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT für Tabelle `kick`
--
ALTER TABLE `kick`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `mutes`
--
ALTER TABLE `mutes`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT für Tabelle `punish`
--
ALTER TABLE `punish`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `rewards`
--
ALTER TABLE `rewards`
  MODIFY `id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT für Tabelle `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT für Tabelle `stats`
--
ALTER TABLE `stats`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=200;

--
-- AUTO_INCREMENT für Tabelle `warns`
--
ALTER TABLE `warns`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
