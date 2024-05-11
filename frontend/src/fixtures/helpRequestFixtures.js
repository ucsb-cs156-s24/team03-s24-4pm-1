const helpRequestFixtures = {
    oneHelpRequest: 
        {
            "id": 1,
            "requesterEmail": "aidenpham@ucsb.edu",
            "teamId": "s24-4pm-1",
            "tableOrBreakoutRoom": "1",
            "requestTime": "2022-04-03T12:00:00",
            "explanation": "Swagger",
            "solved": false, 
        },
    threeHelpRequests:
    [
        {
            "id": 1,
            "requesterEmail": "cgaucho@ucsb.edu",
            "teamId": "s24-4pm-2",
            "tableOrBreakoutRoom": "13",
            "requestTime": "2022-04-04T12:00:00",
            "explanation": "Dokku",
            "solved": false, 
        },
        {
            "id": 2,
            "requesterEmail": "cyang@ucsb.edu",
            "teamId": "s24-5pm-1",
            "tableOrBreakoutRoom": "9",
            "requestTime": "2022-05-03T12:00:00",
            "explanation": "Postgres",
            "solved": false, 
        },
        {
            "id": 3,
            "requesterEmail": "phtcon@ucsb.edu",
            "teamId": "s24-5pm-5",
            "tableOrBreakoutRoom": "4",
            "requestTime": "2022-04-10T12:00:00",
            "explanation": "ReactJS",
            "solved": false, 
        },
    ]
};

export { helpRequestFixtures };