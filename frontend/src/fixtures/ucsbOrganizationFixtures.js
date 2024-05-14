
// public class UCSBOrganization {
//     @Id
//     private String orgCode;
//     private String orgTranslationShort;
//     private String orgTranslation;
//     private boolean inactive;
// SKY	SKYDIVING CLUB	SKYDIVING CLUB AT UCSB	false
// OSLI	STUDENT LIFE	OFFICE OF STUDENT LIFE	false
// KRC	KOREAN RADIO CL	KOREAN RADIO CLUB	false

const ucsbOrganizationFixtures = {
    oneOrganization:
    [
        {
            "orgCode": "ZPR",
            "orgTranslationShort": "ZETA PHI RHO",
            "orgTranslation": "ZETA PHI RHO",
            "inactive": false
        }
    ],
    threeOrganizations:
    [
        {
            "orgCode": "SKY",
            "orgTranslationShort": "SKYDIVING CLUB",
            "orgTranslation": "SKYDIVING CLUB AT UCSB",
            "inactive": false
        },
        {
            "orgCode": "OSLI",
            "orgTranslationShort": "STUDENT LIFE",
            "orgTranslation": "OFFICE OF STUDENT LIFE",
            "inactive": false
        },
        {
            "orgCode": "KRC",
            "orgTranslationShort": "KOREAN RADIO CL",
            "orgTranslation": "KOREAN RADIO CLUB",
            "inactive": false
        }
    ]
};

export { ucsbOrganizationFixtures };