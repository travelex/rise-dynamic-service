const modifyEvent = {
    Records: [
        {
            eventID: '156831831b527cf61a94472a4be1e912',
            eventName: 'MODIFY',
            eventVersion: '1.1',
            eventSource: 'aws:dynamodb',
            awsRegion: 'ap-south-1',
            dynamodb: [{
                "ApproximateCreationDateTime": 1656242698,
                "Keys": {
                    "email_id": {
                        "S": "arbaz.khan@travelex.com"
                    }
                },
                "NewImage": {
                    "email_id": {
                        "S": "arbaz.khan@travelex.com"
                    },
                    "mentor": {
                        "M": {
                            "matching_criterias": {
                                "M": {
                                    "search_criterias": {
                                        "L": [
                                            {
                                                "S": "skills"
                                            },
                                            {
                                                "S": "qualifications"
                                            },
                                            {
                                                "S": "My area of expertise"
                                            },
                                            {
                                                "S": "availability"
                                            }
                                        ]
                                    },
                                    "job_level_boundaries": {
                                        "L": [
                                            {
                                                "N": "4"
                                            },
                                            {
                                                "N": "5"
                                            }
                                        ]
                                    }
                                }
                            },
                            "is_line_manager_agreed": {
                                "BOOL": true
                            },
                            "mentoring_skills": {
                                "M": {
                                    "technologies": {
                                        "L": [
                                            {
                                                "S": "nodejs"
                                            },
                                            {
                                                "S": "mysql"
                                            }
                                        ]
                                    },
                                    "industry_knowledge": {
                                        "L": [
                                            {
                                                "S": "serverless framework"
                                            }
                                        ]
                                    },
                                    "soft_skills": {
                                        "L": [
                                            {
                                                "S": "communication skill"
                                            },
                                            {
                                                "S": "writing communication skills"
                                            }
                                        ]
                                    },
                                    "tools": {
                                        "L": [
                                            {
                                                "S": "Jira"
                                            },
                                            {
                                                "S": "Vscode"
                                            },
                                            {
                                                "S": "Github"
                                            }
                                        ]
                                    },
                                    "others": {
                                        "L": []
                                    }
                                }
                            },
                            "status": {
                                "S": "BOOKED"
                            }
                        }
                    },
                    "preferences": {
                        "M": {
                            "availability": {
                                "M": {
                                    "times": {
                                        "L": [
                                            {
                                                "M": {
                                                    "zone": {
                                                        "S": "IST"
                                                    },
                                                    "from": {
                                                        "S": "16:00:00.000"
                                                    },
                                                    "to": {
                                                        "S": "17:00:00.000"
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    "days": {
                                        "L": [
                                            {
                                                "S": "monday"
                                            },
                                            {
                                                "S": "wednesday"
                                            }
                                        ]
                                    }
                                }
                            },
                            "communication_modes": {
                                "L": [
                                    {
                                        "S": "teams"
                                    },
                                    {
                                        "S": "face-to-face"
                                    }
                                ]
                            }
                        }
                    },
                    "prof_qualifications": {
                        "S": "B.Tech"
                    },
                    "linkedin_id": {
                        "S": ""
                    },
                    "profile_picture": {
                        "S": ""
                    },
                    "prof_experience": {
                        "N": "2"
                    },
                    "about_me": {
                        "S": "HI"
                    },
                    "skills": {
                        "M": {
                            "technologies": {
                                "L": [
                                    {
                                        "S": "aws"
                                    },
                                    {
                                        "S": "nodejs"
                                    },
                                    {
                                        "S": "mysql"
                                    },
                                    {
                                        "S": "html"
                                    },
                                    {
                                        "S": "css"
                                    },
                                    {
                                        "S": "hbs"
                                    }
                                ]
                            },
                            "industry_knowledge": {
                                "L": [
                                    {
                                        "S": "aws"
                                    },
                                    {
                                        "S": "nodejs"
                                    },
                                    {
                                        "S": "mysql"
                                    },
                                    {
                                        "S": "html"
                                    },
                                    {
                                        "S": "css"
                                    },
                                    {
                                        "S": "hbs"
                                    }
                                ]
                            },
                            "soft_skills": {
                                "L": [
                                    {
                                        "S": "communication"
                                    },
                                    {
                                        "S": "writing communication"
                                    }
                                ]
                            },
                            "tools": {
                                "L": [
                                    {
                                        "S": "vscode"
                                    },
                                    {
                                        "S": "MSSQL Server management studio"
                                    },
                                    {
                                        "S": "Confluence"
                                    },
                                    {
                                        "S": "Jira"
                                    }
                                ]
                            },
                            "others": {
                                "L": []
                            }
                        }
                    },
                    "default_profile": {
                        "S": "mentee"
                    },
                    "name": {
                        "M": {
                            "middle": {
                                "S": ""
                            },
                            "last": {
                                "S": "khan"
                            },
                            "first": {
                                "S": "Arbaz"
                            }
                        }
                    },
                    "location": {
                        "S": "mumbai, India"
                    },
                    "area_of_expertize": {
                        "S": "nodejs,sql"
                    },
                    "job_level": {
                        "N": "4"
                    },
                    "department": {
                        "S": "IT"
                    },
                    "mentee": {
                        "M": {
                            "is_line_manager_agreed": {
                                "BOOL": true
                            },
                            "required_skills": {
                                "M": {
                                    "technologies": {
                                        "L": [
                                            {
                                                "S": "terraform"
                                            }
                                        ]
                                    },
                                    "industry_knowledge": {
                                        "L": [
                                            {
                                                "S": "aws"
                                            },
                                            {
                                                "S": "CI/CD"
                                            }
                                        ]
                                    },
                                    "soft_skills": {
                                        "L": [
                                            {
                                                "S": "decision making"
                                            },
                                            {
                                                "S": "presentation"
                                            },
                                            {
                                                "S": "influencing"
                                            }
                                        ]
                                    },
                                    "tools": {
                                        "L": [
                                            {
                                                "S": "mysql"
                                            }
                                        ]
                                    },
                                    "others": {
                                        "L": []
                                    }
                                }
                            }
                        }
                    }
                },
                "OldImage": {
                    "email_id": {
                        "S": "arbaz.khan@travelex.com"
                    },
                    "mentor": {
                        "M": {
                            "matching_criterias": {
                                "M": {
                                    "search_criterias": {
                                        "L": [
                                            {
                                                "S": "skills"
                                            },
                                            {
                                                "S": "qualifications"
                                            },
                                            {
                                                "S": "My area of expertise"
                                            },
                                            {
                                                "S": "availability"
                                            }
                                        ]
                                    },
                                    "job_level_boundaries": {
                                        "L": [
                                            {
                                                "N": "4"
                                            },
                                            {
                                                "N": "5"
                                            }
                                        ]
                                    }
                                }
                            },
                            "is_line_manager_agreed": {
                                "BOOL": true
                            },
                            "mentoring_skills": {
                                "M": {
                                    "technologies": {
                                        "L": [
                                            {
                                                "S": "nodejs"
                                            },
                                            {
                                                "S": "mysql"
                                            }
                                        ]
                                    },
                                    "industry_knowledge": {
                                        "L": [
                                            {
                                                "S": "serverless framework"
                                            }
                                        ]
                                    },
                                    "soft_skills": {
                                        "L": [
                                            {
                                                "S": "communication skill"
                                            },
                                            {
                                                "S": "writing communication skills"
                                            }
                                        ]
                                    },
                                    "tools": {
                                        "L": [
                                            {
                                                "S": "Jira"
                                            },
                                            {
                                                "S": "Vscode"
                                            },
                                            {
                                                "S": "Github"
                                            }
                                        ]
                                    },
                                    "others": {
                                        "L": []
                                    }
                                }
                            },
                            "status": {
                                "S": "BOOKED"
                            }
                        }
                    },
                    "preferences": {
                        "M": {
                            "availability": {
                                "M": {
                                    "times": {
                                        "L": [
                                            {
                                                "M": {
                                                    "zone": {
                                                        "S": "IST"
                                                    },
                                                    "from": {
                                                        "S": "16:00:00.000"
                                                    },
                                                    "to": {
                                                        "S": "17:00:00.000"
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    "days": {
                                        "L": [
                                            {
                                                "S": "monday"
                                            },
                                            {
                                                "S": "wednesday"
                                            }
                                        ]
                                    }
                                }
                            },
                            "communication_modes": {
                                "L": [
                                    {
                                        "S": "teams"
                                    },
                                    {
                                        "S": "f2f"
                                    }
                                ]
                            }
                        }
                    },
                    "prof_qualifications": {
                        "S": "B.Tech"
                    },
                    "linkedin_id": {
                        "S": ""
                    },
                    "profile_picture": {
                        "S": ""
                    },
                    "prof_experience": {
                        "N": "2"
                    },
                    "about_me": {
                        "S": ""
                    },
                    "skills": {
                        "M": {
                            "technologies": {
                                "L": [
                                    {
                                        "S": "aws"
                                    },
                                    {
                                        "S": "nodejs"
                                    },
                                    {
                                        "S": "mysql"
                                    },
                                    {
                                        "S": "html"
                                    },
                                    {
                                        "S": "css"
                                    },
                                    {
                                        "S": "hbs"
                                    }
                                ]
                            },
                            "industry_knowledge": {
                                "L": [
                                    {
                                        "S": "aws"
                                    },
                                    {
                                        "S": "nodejs"
                                    },
                                    {
                                        "S": "mysql"
                                    },
                                    {
                                        "S": "html"
                                    },
                                    {
                                        "S": "css"
                                    },
                                    {
                                        "S": "hbs"
                                    }
                                ]
                            },
                            "soft_skills": {
                                "L": [
                                    {
                                        "S": "communication"
                                    },
                                    {
                                        "S": "writing communication"
                                    }
                                ]
                            },
                            "tools": {
                                "L": [
                                    {
                                        "S": "vscode"
                                    },
                                    {
                                        "S": "MSSQL Server management studio"
                                    },
                                    {
                                        "S": "Confluence"
                                    },
                                    {
                                        "S": "Jira"
                                    }
                                ]
                            },
                            "others": {
                                "L": []
                            }
                        }
                    },
                    "default_profile": {
                        "S": "mentee"
                    },
                    "name": {
                        "M": {
                            "middle": {
                                "S": ""
                            },
                            "last": {
                                "S": "khan"
                            },
                            "first": {
                                "S": "Arbaz"
                            }
                        }
                    },
                    "location": {
                        "S": "mumbai, India"
                    },
                    "area_of_expertize": {
                        "S": "nodejs,sql"
                    },
                    "job_level": {
                        "N": "4"
                    },
                    "department": {
                        "S": "IT"
                    },
                    "mentee": {
                        "M": {
                            "is_line_manager_agreed": {
                                "BOOL": true
                            },
                            "required_skills": {
                                "M": {
                                    "technologies": {
                                        "L": [
                                            {
                                                "S": "terraform"
                                            }
                                        ]
                                    },
                                    "industry_knowledge": {
                                        "L": [
                                            {
                                                "S": "aws"
                                            },
                                            {
                                                "S": "CI/CD"
                                            }
                                        ]
                                    },
                                    "soft_skills": {
                                        "L": [
                                            {
                                                "S": "decision making"
                                            },
                                            {
                                                "S": "presentation"
                                            },
                                            {
                                                "S": "influencing"
                                            }
                                        ]
                                    },
                                    "tools": {
                                        "L": [
                                            {
                                                "S": "mysql"
                                            }
                                        ]
                                    },
                                    "others": {
                                        "L": []
                                    }
                                }
                            }
                        }
                    }
                },
                "SequenceNumber": "6532300000000015034248898",
                "SizeBytes": 2357,
                "StreamViewType": "NEW_AND_OLD_IMAGES"
            }
            ],
            eventSourceARN: 'arn:aws:dynamodb:ap-south-1:738131246206:table/userprofile/stream/2022-06-26T11:22:56.030'
        }
    ]
}

const removeEvent = {
    Records: [
        {
            eventID: 'd31748e86fec97d93654419cb8b871e9',
            eventName: 'REMOVE',
            eventVersion: '1.1',
            eventSource: 'aws:dynamodb',
            awsRegion: 'ap-south-1',
            dynamodb: [{
                "ApproximateCreationDateTime": 1656243074,
                "Keys": {
                    "email_id": {
                        "S": "arbaz.khan@travelex.com"
                    }
                },
                "OldImage": {
                    "email_id": {
                        "S": "arbaz.khan@travelex.com"
                    },
                    "mentor": {
                        "M": {
                            "matching_criterias": {
                                "M": {
                                    "search_criterias": {
                                        "L": [
                                            {
                                                "S": "skills"
                                            },
                                            {
                                                "S": "qualifications"
                                            },
                                            {
                                                "S": "My area of expertise"
                                            },
                                            {
                                                "S": "availability"
                                            }
                                        ]
                                    },
                                    "job_level_boundaries": {
                                        "L": [
                                            {
                                                "N": "4"
                                            },
                                            {
                                                "N": "5"
                                            }
                                        ]
                                    }
                                }
                            },
                            "is_line_manager_agreed": {
                                "BOOL": true
                            },
                            "mentoring_skills": {
                                "M": {
                                    "technologies": {
                                        "L": [
                                            {
                                                "S": "nodejs"
                                            },
                                            {
                                                "S": "mysql"
                                            }
                                        ]
                                    },
                                    "industry_knowledge": {
                                        "L": [
                                            {
                                                "S": "serverless framework"
                                            }
                                        ]
                                    },
                                    "soft_skills": {
                                        "L": [
                                            {
                                                "S": "communication skill"
                                            },
                                            {
                                                "S": "writing communication skills"
                                            }
                                        ]
                                    },
                                    "tools": {
                                        "L": [
                                            {
                                                "S": "Jira"
                                            },
                                            {
                                                "S": "Vscode"
                                            },
                                            {
                                                "S": "Github"
                                            }
                                        ]
                                    },
                                    "others": {
                                        "L": []
                                    }
                                }
                            },
                            "status": {
                                "S": "OPEN"
                            }
                        }
                    },
                    "preferences": {
                        "M": {
                            "availability": {
                                "M": {
                                    "times": {
                                        "L": [
                                            {
                                                "M": {
                                                    "zone": {
                                                        "S": "IST"
                                                    },
                                                    "from": {
                                                        "S": "16:00:00.000"
                                                    },
                                                    "to": {
                                                        "S": "17:00:00.000"
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    "days": {
                                        "L": [
                                            {
                                                "S": "monday"
                                            },
                                            {
                                                "S": "wednesday"
                                            }
                                        ]
                                    }
                                }
                            },
                            "communication_modes": {
                                "L": [
                                    {
                                        "S": "teams"
                                    },
                                    {
                                        "S": "f2f"
                                    }
                                ]
                            }
                        }
                    },
                    "prof_qualifications": {
                        "S": "B.Tech"
                    },
                    "linkedin_id": {
                        "S": ""
                    },
                    "profile_picture": {
                        "S": ""
                    },
                    "prof_experience": {
                        "N": "2"
                    },
                    "about_me": {
                        "S": "HI"
                    },
                    "skills": {
                        "M": {
                            "technologies": {
                                "L": [
                                    {
                                        "S": "aws"
                                    },
                                    {
                                        "S": "nodejs"
                                    },
                                    {
                                        "S": "mysql"
                                    },
                                    {
                                        "S": "html"
                                    },
                                    {
                                        "S": "css"
                                    },
                                    {
                                        "S": "hbs"
                                    }
                                ]
                            },
                            "industry_knowledge": {
                                "L": [
                                    {
                                        "S": "aws"
                                    },
                                    {
                                        "S": "nodejs"
                                    },
                                    {
                                        "S": "mysql"
                                    },
                                    {
                                        "S": "html"
                                    },
                                    {
                                        "S": "css"
                                    },
                                    {
                                        "S": "hbs"
                                    }
                                ]
                            },
                            "soft_skills": {
                                "L": [
                                    {
                                        "S": "communication"
                                    },
                                    {
                                        "S": "writing communication"
                                    }
                                ]
                            },
                            "tools": {
                                "L": [
                                    {
                                        "S": "vscode"
                                    },
                                    {
                                        "S": "MSSQL Server management studio"
                                    },
                                    {
                                        "S": "Confluence"
                                    },
                                    {
                                        "S": "Jira"
                                    }
                                ]
                            },
                            "others": {
                                "L": []
                            }
                        }
                    },
                    "default_profile": {
                        "S": "mentee"
                    },
                    "name": {
                        "M": {
                            "middle": {
                                "S": ""
                            },
                            "last": {
                                "S": "khan"
                            },
                            "first": {
                                "S": "Arbaz"
                            }
                        }
                    },
                    "location": {
                        "S": "mumbai, India"
                    },
                    "area_of_expertize": {
                        "S": "nodejs,sql"
                    },
                    "job_level": {
                        "N": "4"
                    },
                    "department": {
                        "S": "IT"
                    },
                    "mentee": {
                        "M": {
                            "is_line_manager_agreed": {
                                "BOOL": true
                            },
                            "required_skills": {
                                "M": {
                                    "technologies": {
                                        "L": [
                                            {
                                                "S": "terraform"
                                            }
                                        ]
                                    },
                                    "industry_knowledge": {
                                        "L": [
                                            {
                                                "S": "aws"
                                            },
                                            {
                                                "S": "CI/CD"
                                            }
                                        ]
                                    },
                                    "soft_skills": {
                                        "L": [
                                            {
                                                "S": "decision making"
                                            },
                                            {
                                                "S": "presentation"
                                            },
                                            {
                                                "S": "influencing"
                                            }
                                        ]
                                    },
                                    "tools": {
                                        "L": [
                                            {
                                                "S": "mysql"
                                            }
                                        ]
                                    },
                                    "others": {
                                        "L": []
                                    }
                                }
                            }
                        }
                    }
                },
                "SequenceNumber": "6532400000000015034267162",
                "SizeBytes": 1195,
                "StreamViewType": "NEW_AND_OLD_IMAGES"
            }
            ],
            eventSourceARN: 'arn:aws:dynamodb:ap-south-1:738131246206:table/userprofile/stream/2022-06-26T11:22:56.030'
        }
    ]
}


const insertEvent = {
    Records: [
        {
            eventID: '1427da4d7b260605b67bc098205df8c2',
            eventName: 'INSERT',
            eventVersion: '1.1',
            eventSource: 'aws:dynamodb',
            awsRegion: 'ap-south-1',
            dynamodb: [{
                "ApproximateCreationDateTime": 1656245760,
                "Keys": {
                    "email_id": {
                        "S": "arbaz.khan@travelex.com"
                    }
                },
                "NewImage": {
                    "email_id": {
                        "S": "arbaz.khan@travelex.com"
                    },
                    "mentor": {
                        "M": {
                            "matching_criterias": {
                                "M": {
                                    "search_criterias": {
                                        "L": [
                                            {
                                                "S": "skills"
                                            },
                                            {
                                                "S": "qualifications"
                                            },
                                            {
                                                "S": "My area of expertise"
                                            },
                                            {
                                                "S": "availability"
                                            }
                                        ]
                                    },
                                    "job_level_boundaries": {
                                        "L": [
                                            {
                                                "N": "4"
                                            },
                                            {
                                                "N": "5"
                                            }
                                        ]
                                    }
                                }
                            },
                            "is_line_manager_agreed": {
                                "BOOL": true
                            },
                            "mentoring_skills": {
                                "M": {
                                    "technologies": {
                                        "L": [
                                            {
                                                "S": "nodejs"
                                            },
                                            {
                                                "S": "mysql"
                                            }
                                        ]
                                    },
                                    "industry_knowledge": {
                                        "L": [
                                            {
                                                "S": "serverless framework"
                                            }
                                        ]
                                    },
                                    "soft_skills": {
                                        "L": [
                                            {
                                                "S": "communication skill"
                                            },
                                            {
                                                "S": "writing communication skills"
                                            }
                                        ]
                                    },
                                    "tools": {
                                        "L": [
                                            {
                                                "S": "Jira"
                                            },
                                            {
                                                "S": "Vscode"
                                            },
                                            {
                                                "S": "Github"
                                            }
                                        ]
                                    },
                                    "others": {
                                        "L": []
                                    }
                                }
                            },
                            "status": {
                                "S": "OPEN"
                            }
                        }
                    },
                    "preferences": {
                        "M": {
                            "availability": {
                                "M": {
                                    "times": {
                                        "L": [
                                            {
                                                "M": {
                                                    "zone": {
                                                        "S": "IST"
                                                    },
                                                    "from": {
                                                        "S": "16:00:00.000"
                                                    },
                                                    "to": {
                                                        "S": "17:00:00.000"
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    "days": {
                                        "L": [
                                            {
                                                "S": "monday"
                                            },
                                            {
                                                "S": "wednesday"
                                            }
                                        ]
                                    }
                                }
                            },
                            "communication_modes": {
                                "L": [
                                    {
                                        "S": "teams"
                                    },
                                    {
                                        "S": "f2f"
                                    }
                                ]
                            }
                        }
                    },
                    "prof_qualifications": {
                        "S": "B.Tech"
                    },
                    "linkedin_id": {
                        "S": ""
                    },
                    "profile_picture": {
                        "S": ""
                    },
                    "prof_experience": {
                        "N": "2"
                    },
                    "about_me": {
                        "S": ""
                    },
                    "skills": {
                        "M": {
                            "technologies": {
                                "L": [
                                    {
                                        "S": "aws"
                                    },
                                    {
                                        "S": "nodejs"
                                    },
                                    {
                                        "S": "mysql"
                                    },
                                    {
                                        "S": "html"
                                    },
                                    {
                                        "S": "css"
                                    },
                                    {
                                        "S": "hbs"
                                    }
                                ]
                            },
                            "industry_knowledge": {
                                "L": [
                                    {
                                        "S": "aws"
                                    },
                                    {
                                        "S": "nodejs"
                                    },
                                    {
                                        "S": "mysql"
                                    },
                                    {
                                        "S": "html"
                                    },
                                    {
                                        "S": "css"
                                    },
                                    {
                                        "S": "hbs"
                                    }
                                ]
                            },
                            "soft_skills": {
                                "L": [
                                    {
                                        "S": "communication"
                                    },
                                    {
                                        "S": "writing communication"
                                    }
                                ]
                            },
                            "tools": {
                                "L": [
                                    {
                                        "S": "vscode"
                                    },
                                    {
                                        "S": "MSSQL Server management studio"
                                    },
                                    {
                                        "S": "Confluence"
                                    },
                                    {
                                        "S": "Jira"
                                    }
                                ]
                            },
                            "others": {
                                "L": []
                            }
                        }
                    },
                    "default_profile": {
                        "S": "mentee"
                    },
                    "name": {
                        "M": {
                            "middle": {
                                "S": ""
                            },
                            "last": {
                                "S": "khan"
                            },
                            "first": {
                                "S": "Arbaz"
                            }
                        }
                    },
                    "location": {
                        "S": "mumbai, India"
                    },
                    "area_of_expertize": {
                        "S": "nodejs,sql"
                    },
                    "job_level": {
                        "N": "4"
                    },
                    "department": {
                        "S": "IT"
                    },
                    "mentee": {
                        "M": {
                            "is_line_manager_agreed": {
                                "BOOL": true
                            },
                            "required_skills": {
                                "M": {
                                    "technologies": {
                                        "L": [
                                            {
                                                "S": "terraform"
                                            }
                                        ]
                                    },
                                    "industry_knowledge": {
                                        "L": [
                                            {
                                                "S": "aws"
                                            },
                                            {
                                                "S": "CI/CD"
                                            }
                                        ]
                                    },
                                    "soft_skills": {
                                        "L": [
                                            {
                                                "S": "decision making"
                                            },
                                            {
                                                "S": "presentation"
                                            },
                                            {
                                                "S": "influencing"
                                            }
                                        ]
                                    },
                                    "tools": {
                                        "L": [
                                            {
                                                "S": "mysql"
                                            }
                                        ]
                                    },
                                    "others": {
                                        "L": []
                                    }
                                }
                            }
                        }
                    }
                },
                "SequenceNumber": "6532500000000015034468170",
                "SizeBytes": 1193,
                "StreamViewType": "NEW_AND_OLD_IMAGES"
            }
            ],
            eventSourceARN: 'arn:aws:dynamodb:ap-south-1:738131246206:table/userprofile/stream/2022-06-26T11:22:56.030'
        }
    ]
}

module.exports = {
    modifyEvent,
    removeEvent,
    insertEvent
};