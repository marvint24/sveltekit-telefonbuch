USE [Kontaktverzeichnis]
GO
/****** Object:  View [dbo].[JSONPerson]    Script Date: 25.07.2023 14:18:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create   view [dbo].[JSONPerson] as
select person.id as id,
vorname,
nachname,
personalnummer,
kostenstelle,
email,
titel,

(select 
telefonEintrag.id,
nummer,
standort.bezeichnung as standort,
eintragTyp.bezeichnung as eintragTyp
from telefonEintragperson
join telefonEintrag on telefonEintrag.id=telefonEintragperson.telefonEintragID
join eintragTyp on telefonEintrag.eintragTypID=eintragTyp.id
join standort on telefonEintrag.standortID=standort.id
where telefonEintragperson.personID=person.id for json path
) as telefonEintrag,

(select 
id,
bezeichnung
from personabteilung
join abteilung on abteilung.id=personabteilung.abteilungID
where personabteilung.personID=person.id for json path
) as abteilung,

(select 
id,
bezeichnung
from standortperson
join standort on standort.id=standortperson.standortID
where standortperson.personID=person.id for json path
) as standort

from person
--where person.id=30215 
--for json path






GO
