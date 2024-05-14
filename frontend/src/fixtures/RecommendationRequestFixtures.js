const recommendationRequestFixtures = {
    oneRecommendationRequest: {
        "id": 1,
        "requesterEmail": "test@gmail.com",
        "professorEmail": "test@gmail.com",
        "explanation": "na",
        "dateRequested": "2022-01-02T12:00:00",
        "dateNeeded": "2022-01-02T12:00:00",
        "done": "true"       
    },
    threeRecommendationRequests:
    [
        {
            "id": 2,
            "requesterEmail": "test2@gmail.com",
            "professorEmail": "test2@gmail.com",
            "explanation": "na2",
            "dateRequested": "2022-01-02T12:00:00",
            "dateNeeded": "2022-01-02T12:00:00",
            "done": "false"         
        },
        {
            "id": 3,
            "requesterEmail": "test3@gmail.com",
            "professorEmail": "test3@gmail.com",
            "explanation": "na3",
            "dateRequested": "2022-01-02T12:00:00",
            "dateNeeded": "2022-01-02T12:00:00",
            "done": "true"      
        },
        {
            "id": 4,
            "requesterEmail": "test4@gmail.com",
            "professorEmail": "test4@gmail.com",
            "explanation": "na4",
            "dateRequested": "2022-01-02T12:00:00",
            "dateNeeded": "2022-01-02T12:00:00",
            "done": "true"    
        },
    ]
};

export { recommendationRequestFixtures };