// geografiaData.ts
// Catálogo de departamentos y municipios de Guatemala

export const DEPARTAMENTOS = [
    "ALTA VERAPAZ",
    "BAJA VERAPAZ",
    "CHIMALTENANGO",
    "CHIQUIMULA",
    "EL PROGRESO",
    "ESCUINTLA",
    "GUATEMALA",
    "HUEHUETENANGO",
    "IZABAL",
    "JALAPA",
    "JUTIAPA",
    "PETÉN",
    "QUETZALTENANGO",
    "QUICHÉ",
    "RETALHULEU",
    "SACATEPÉQUEZ",
    "SAN MARCOS",
    "SANTA ROSA",
    "SOLOLÁ",
    "SUCHITEPÉQUEZ",
    "TOTONICAPÁN",
    "ZACAPA"
] as const;

export type Departamento = typeof DEPARTAMENTOS[number];

export const MUNICIPIOS_POR_DEPARTAMENTO: Record<Departamento, string[]> = {
    "ALTA VERAPAZ": [
        "COBÁN",
        "SANTA CRUZ VERAPAZ",
        "SAN CRISTÓBAL VERAPAZ",
        "TACTIC",
        "TAMAHÚ",
        "SAN MIGUEL TUCURÚ",
        "PANZÓS",
        "SENAHÚ",
        "SAN PEDRO CARCHÁ",
        "SAN JUAN CHAMELCO",
        "SAN AGUSTÍN LANQUÍN",
        "SANTA MARÍA CAHABÓN",
        "CHISEC",
        "CHAHAL",
        "FRAY BARTOLOMÉ DE LAS CASAS",
        "SANTA CATALINA LA TINTA",
        "RAXRUHÁ"
    ],

    "BAJA VERAPAZ": [
        "SALAMÁ",
        "SAN MIGUEL CHICAJ",
        "RABINAL",
        "CUBULCO",
        "GRANADOS",
        "SANTA CRUZ EL CHOL",
        "SAN JERÓNIMO",
        "PURULHÁ"
    ],

    "CHIMALTENANGO": [
        "CHIMALTENANGO",
        "SAN JOSÉ POAQUIL",
        "SAN MARTÍN JILOTEPEQUE",
        "SAN JUAN COMALAPA",
        "SANTA APOLONIA",
        "TECPÁN GUATEMALA",
        "PATZÚN",
        "POCHUTA",
        "PATZICÍA",
        "SANTA CRUZ BALANYÁ",
        "ACATENANGO",
        "YEPOCAPA",
        "SAN ANDRÉS ITZAPA",
        "PARRAMOS",
        "ZARAGOZA",
        "EL TEJAR"
    ],

    "CHIQUIMULA": [
        "CHIQUIMULA",
        "SAN JOSÉ LA ARADA",
        "SAN JUAN ERMITA",
        "JOCOTÁN",
        "CAMOTÁN",
        "OLOPA",
        "ESQUIPULAS",
        "CONCEPCIÓN LAS MINAS",
        "QUEZALTEPEQUE",
        "SAN JACINTO",
        "IPALA"
    ],

    "EL PROGRESO": [
        "GUASTATOYA",
        "MORAZÁN",
        "SAN AGUSTÍN ACASAGUASTLÁN",
        "SAN CRISTÓBAL ACASAGUASTLÁN",
        "EL JÍCARO",
        "SANSARE",
        "SANARATE",
        "SAN ANTONIO LA PAZ"
    ],

    "ESCUINTLA": [
        "ESCUINTLA",
        "SANTA LUCÍA COTZUMALGUAPA",
        "LA DEMOCRACIA",
        "SIQUINALÁ",
        "MASAGUA",
        "TIQUISATE",
        "LA GOMERA",
        "GUANAGAZAPA",
        "SAN JOSÉ",
        "IZTAPA",
        "PALÍN",
        "SAN VICENTE PACAYA",
        "NUEVA CONCEPCIÓN",
        "SAN JUAN ALOTENANGO"
    ],

    "GUATEMALA": [
        "GUATEMALA",
        "SANTA CATARINA PINULA",
        "SAN JOSÉ PINULA",
        "SAN JOSÉ DEL GOLFO",
        "PALENCIA",
        "CHINAUTLA",
        "SAN PEDRO AYAMPUC",
        "MIXCO",
        "SAN PEDRO SACATEPÉQUEZ",
        "SAN JUAN SACATEPÉQUEZ",
        "SAN RAYMUNDO",
        "CHUARRANCHO",
        "FRAIJANES",
        "AMATITLÁN",
        "VILLA NUEVA",
        "VILLA CANALES",
        "SAN MIGUEL PETAPA"
    ],

    "HUEHUETENANGO": [
        "HUEHUETENANGO",
        "CHIANTLA",
        "MALACATANCITO",
        "CUILCO",
        "NENTÓN",
        "SAN PEDRO NECTA",
        "JACALTENANGO",
        "SAN PEDRO SOLOMA",
        "SAN ILDEFONSO IXTAHUACÁN",
        "SANTA BÁRBARA",
        "LA LIBERTAD",
        "LA DEMOCRACIA",
        "SAN MIGUEL ACATÁN",
        "SAN RAFAEL LA INDEPENDENCIA",
        "TODOS SANTOS CUCHUMATÁN",
        "SAN JUAN ATITÁN",
        "SANTA EULALIA",
        "SAN MATEO IXTATÁN",
        "COLOTENANGO",
        "SAN SEBASTIÁN HUEHUETENANGO",
        "TECTITÁN",
        "CONCEPCIÓN HUISTA",
        "SAN JUAN IXCOY",
        "SAN ANTONIO HUISTA",
        "SAN SEBASTIÁN COATÁN",
        "SANTA CRUZ BARILLAS",
        "AGUACATÁN",
        "SAN RAFAEL PETZAL",
        "SAN GASPAR IXCHIL",
        "SANTIAGO CHIMALTENANGO",
        "SANTA ANA HUISTA",
        "UNIÓN CANTINIL",
        "PETATÁN"
    ],

    "IZABAL": [
        "PUERTO BARRIOS",
        "LIVINGSTON",
        "EL ESTOR",
        "MORALES",
        "LOS AMATES"
    ],

    "JALAPA": [
        "JALAPA",
        "SAN PEDRO PINULA",
        "SAN LUIS JILOTEPEQUE",
        "SAN MANUEL CHAPARRÓN",
        "SAN CARLOS ALZATATE",
        "MONJAS",
        "MATAQUESCUINTLA"
    ],

    "JUTIAPA": [
        "JUTIAPA",
        "EL PROGRESO",
        "SANTA CATARINA MITA",
        "AGUA BLANCA",
        "ASUNCIÓN MITA",
        "YUPILTEPEQUE",
        "ATESCATEMPA",
        "JEREZ",
        "EL ADELANTO",
        "ZAPOTITLÁN",
        "COMAPA",
        "JALPATAGUA",
        "CONGUACO",
        "MOYUTA",
        "PASACO",
        "QUESADA",
        "SAN JOSÉ ACATEMPA"
    ],

    "PETÉN": [
        "FLORES",
        "SAN JOSÉ",
        "SAN BENITO",
        "SAN ANDRÉS",
        "LA LIBERTAD",
        "SAN FRANCISCO",
        "SANTA ANA",
        "DOLORES",
        "SAN LUIS",
        "SAYAXCHÉ",
        "MELCHOR DE MENCOS",
        "POPTÚN",
        "LAS CRUCES",
        "EL CHAL"
    ],

    "QUETZALTENANGO": [
        "QUETZALTENANGO",
        "SALCAJÁ",
        "OLINTEPEQUE",
        "SAN CARLOS SIJA",
        "SIBILIA",
        "CABRICÁN",
        "CAJOLÁ",
        "SAN MIGUEL SIGÜILÁ",
        "SAN JUAN OSTUNCALCO",
        "SAN MATEO",
        "CONCEPCIÓN CHIQUIRICHAPA",
        "SAN MARTÍN SACATEPÉQUEZ",
        "ALMOLONGA",
        "CANTEL",
        "HUITÁN",
        "ZUNIL",
        "COLOMBA COSTA CUCA",
        "SAN FRANCISCO LA UNIÓN",
        "EL PALMAR",
        "COATEPEQUE",
        "GÉNOVA",
        "FLORES COSTA CUCA",
        "LA ESPERANZA",
        "PALESTINA DE LOS ALTOS"
    ],

    "QUICHÉ": [
        "SANTA CRUZ DEL QUICHÉ",
        "CHICHÉ",
        "CHINIQUE",
        "ZACUALPA",
        "CHAJUL",
        "SANTO TOMÁS CHICHICASTENANGO",
        "PATZITÉ",
        "SAN ANTONIO ILOTENANGO",
        "SAN PEDRO JOCOPILAS",
        "CUNÉN",
        "SAN JUAN COTZAL",
        "JOYABAJ",
        "NEBAJ",
        "SAN ANDRÉS SAJCABAJÁ",
        "SAN MIGUEL USPANTÁN",
        "SACAPULAS",
        "SAN BARTOLOMÉ JOCOTENANGO",
        "CANILLÁ",
        "CHICAMÁN",
        "IXCÁN",
        "PACHALUM"
    ],

    "RETALHULEU": [
        "RETALHULEU",
        "SAN SEBASTIÁN",
        "SANTA CRUZ MULUÁ",
        "SAN MARTÍN ZAPOTITLÁN",
        "SAN FELIPE",
        "SAN ANDRÉS VILLA SECA",
        "CHAMPERICO",
        "NUEVO SAN CARLOS",
        "EL ASINTAL"
    ],

    "SACATEPÉQUEZ": [
        "ANTIGUA GUATEMALA",
        "JOCOTENANGO",
        "PASTORES",
        "SUMPANGO",
        "SANTO DOMINGO XENACOJ",
        "SANTIAGO SACATEPÉQUEZ",
        "SAN BARTOLOMÉ MILPAS ALTAS",
        "SAN LUCAS SACATEPÉQUEZ",
        "SANTA LUCÍA MILPAS ALTAS",
        "MAGDALENA MILPAS ALTAS",
        "SANTA MARÍA DE JESÚS",
        "CIUDAD VIEJA",
        "SAN MIGUEL DUEÑAS",
        "SAN JUAN ALOTENANGO",
        "SAN ANTONIO AGUAS CALIENTES",
        "SANTA CATARINA BARAHONA"
    ],

    "SAN MARCOS": [
        "SAN MARCOS",
        "SAN PEDRO SACATEPÉQUEZ",
        "SAN ANTONIO SACATEPÉQUEZ",
        "COMITANCILLO",
        "SAN MIGUEL IXTAHUACÁN",
        "CONCEPCIÓN TUTUAPA",
        "TACANÁ",
        "SIBINAL",
        "TAJUMULCO",
        "TEJUTLA",
        "SAN RAFAEL PIE DE LA CUESTA",
        "NUEVO PROGRESO",
        "EL TUMBADOR",
        "SAN JOSÉ EL RODEO",
        "MALACATÁN",
        "CATARINA",
        "AYUTLA",
        "OCÓS",
        "SAN PABLO",
        "EL QUETZAL",
        "LA REFORMA",
        "PAJAPITA",
        "IXCHIGUÁN",
        "SAN JOSÉ OJETENAM",
        "SAN CRISTÓBAL CUCHO",
        "SIPACAPA",
        "ESQUIPULAS PALO GORDO",
        "RÍO BLANCO",
        "SAN LORENZO",
        "LA BLANCA"
    ],

    "SANTA ROSA": [
        "CUILAPA",
        "BARBERENA",
        "SANTA ROSA DE LIMA",
        "CASILLAS",
        "SAN RAFAEL LAS FLORES",
        "ORATORIO",
        "SAN JUAN TECUACO",
        "CHIQUIMULILLA",
        "TAXISCO",
        "SANTA MARÍA IXHUATÁN",
        "GUAZACAPÁN",
        "SANTA CRUZ NARANJO",
        "PUEBLO NUEVO VIÑAS",
        "NUEVA SANTA ROSA"
    ],

    "SOLOLÁ": [
        "SOLOLÁ",
        "SAN JOSÉ CHACAYÁ",
        "SANTA MARÍA VISITACIÓN",
        "SANTA LUCÍA UTATLÁN",
        "NAHUALÁ",
        "SANTA CATARINA IXTAHUACÁN",
        "SANTA CLARA LA LAGUNA",
        "CONCEPCIÓN",
        "SAN ANDRÉS SEMETABAJ",
        "PANAJACHEL",
        "SANTA CATARINA PALOPÓ",
        "SAN ANTONIO PALOPÓ",
        "SAN LUCAS TOLIMÁN",
        "SANTA CRUZ LA LAGUNA",
        "SAN PABLO LA LAGUNA",
        "SAN MARCOS LA LAGUNA",
        "SAN JUAN LA LAGUNA",
        "SAN PEDRO LA LAGUNA",
        "SANTIAGO ATITLÁN"
    ],

    "SUCHITEPÉQUEZ": [
        "MAZATENANGO",
        "CUYOTENANGO",
        "SAN FRANCISCO ZAPOTITLÁN",
        "SAN BERNARDINO",
        "SAN JOSÉ EL ÍDOLO",
        "SANTO DOMINGO SUCHITEPÉQUEZ",
        "SAN LORENZO",
        "SAMAYAC",
        "SAN PABLO JOCOPILAS",
        "SAN ANTONIO SUCHITEPÉQUEZ",
        "SAN MIGUEL PANÁN",
        "SAN GABRIEL",
        "CHICACAO",
        "PATULUL",
        "SANTA BÁRBARA",
        "SAN JUAN BAUTISTA",
        "SANTO TOMÁS LA UNIÓN",
        "ZUNILITO",
        "PUEBLO NUEVO",
        "RÍO BRAVO"
    ],

    "TOTONICAPÁN": [
        "TOTONICAPÁN",
        "SAN CRISTÓBAL TOTONICAPÁN",
        "SAN FRANCISCO EL ALTO",
        "SAN ANDRÉS XECUL",
        "MOMOSTENANGO",
        "SANTA MARÍA CHIQUIMULA",
        "SANTA LUCÍA LA REFORMA",
        "SAN BARTOLO"
    ],

    "ZACAPA": [
        "ZACAPA",
        "ESTANZUELA",
        "RÍO HONDO",
        "GUALÁN",
        "TECULUTÁN",
        "USUMATLÁN",
        "CABAÑAS",
        "SAN DIEGO",
        "LA UNIÓN",
        "HUITÉ",
        "SAN JORGE"
    ]
};

// Función helper para obtener municipios de un departamento
export const getMunicipiosByDepartamento = (departamento: string): string[] => {
    if (departamento in MUNICIPIOS_POR_DEPARTAMENTO) {
        return MUNICIPIOS_POR_DEPARTAMENTO[departamento as Departamento];
    }
    return [];
};

// Función para obtener el departamento de un municipio
export const getDepartamentoByMunicipio = (municipio: string): Departamento | null => {
    const municipioUpper = municipio.toUpperCase();
    for (const [departamento, municipios] of Object.entries(MUNICIPIOS_POR_DEPARTAMENTO)) {
        if (municipios.includes(municipioUpper)) {
            return departamento as Departamento;
        }
    }
    return null;
};

// Función para obtener el total de municipios
export const getTotalMunicipios = (): number => {
    return Object.values(MUNICIPIOS_POR_DEPARTAMENTO).reduce(
        (total, municipios) => total + municipios.length,
        0
    );
};