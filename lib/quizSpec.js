export const quizSpec = {
                "header": {
                    "titleImageUrl": "http://path-to-some-image.jpg",
                    "titleText": "Guardian North Korea Quiz",
                    "trailText": "How much do you know about North Korea? Find out by completing this quiz."
                },
                "questions": [
                    {
                        "image": "path-to-question-image.jpg",
                        "question": "Who is the North Korean leader?",
                        "multiChoiceAnswers": [
                            {
                                "image": "picture-of-kju.jpg",
                                "answer": "Kim Jong-Un",
                                "correct": true                            },
                            {
                                "image": "picture-of-kji.jpg",
                                "answer": "Kim Jong-Il",
                                "correct": false                            },
                            {
                                "image": "picture-of-kk.jpg",
                                "answer": "Kim Kardashian",
                                "correct": false
                            }
                        ],
                        "completionMessage": "<a href = 'http://www.theguardian.com/world/kim-jong-il'>Kim Jong-Il</a> died in 2011 having chosen his youngest son, Kim Jong-Un, to be his successor."
                    },
                    {
                        "image": "",
                        "question": "Which recent film sparked anger from the North Korean government, and gave rise to claims of hacking attacks directed at Sony Pictures?",
                        "multiChoiceAnswers": [
                            {
                                "image": "picture-of-titanic.jpg",
                                "answer": "Titanic",
                                "correct": false
                            },
                            {
                                "image": "picture-of-team-america.jpg",
                                "answer": "Team America",
                                "correct": false                            },
                            {
                                "image": "picture-of-the-interview.jpg",
                                "answer": "The Interview",
                                "correct": true                            }
                        ],
                        "completionMessage": "While Team America undoubtedly offended millions worldwide, it seems to have flown under the radar of North Korea. The Interview however, did not."
                    }
                ],
                "resultGroups": [
                    {
                        "image": "path-to-group-1-image.jpg",
                        "title": "You must be from North Korea. Your knowledge about this secretive nation is second to none. Plus there were only two points up for grabs so you obviously HACKED US!",
                        "minScore": 8
                    },
                    {
                        "image": "path-to-group-2-image.jpg",
                        "title": "Really, you should try to keep up with the news more.",
                        "minScore": 4,
                        "maxScore": 7
                    },
                    {
                        "image": "path-to-group3-image.jpg",
                        "title": "Wow, they're letting you use the Internet unsupervised now?",
                        "minScore": 1,
                        "maxScore": 3
                    }
                ],
                "socialHints":[
                    {
                        "service": "twitter",
                        "message": "I scored %score% on the Guardian's North Korea quiz.",
                        "shareImg": "path-to-share-img.jpg",
                        "shareUrl": "http://gu.com/nk?tw"
                    },
                    {
                        "service": "facebook",
                        "message": "So you think you know North Korea? See if you can beat my score of: %score%",
                        "shareImg": "path-to-share-img.jpg",
                        "shareUrl": "http://gu.com/nk?fb"
                    },
                    {
                        "service": "google",
                        "message": "WAT?",
                        "shareImg": "path-to-share-img.jpg",
                        "shareUrl": "http://gu.com/whats-the-point/gplus"
                    }
                ]
};

