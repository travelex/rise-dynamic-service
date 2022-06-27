const covertor = require('dynamo-converters');
const EMPTY_ARRAY = [];
const EMPTY_STRING = '';
class CloudSearchUtility {

    static getProfileFromDynamoEvent(image) {
        try {
            const profile = covertor.itemToData(image);

            if(!profile.mentor){
                throw new Error('Mentor details are not available');
            }
            // Extract cloud search specific fields
            const email_id = profile.email_id;
            let name = profile.name ?? {};
            name = `${name.first}${name.middle ? (' ' + name.middle) : EMPTY_STRING}${name.last ? (' ' + name.last) : EMPTY_STRING}`;
            const department = profile.department ?? EMPTY_STRING;
            const area_of_expertize = profile.area_of_expertize ?? EMPTY_STRING;
            const prof_experience = profile.prof_experience ? String(profile.prof_experience) : '1'
            const location = profile.location ?? ''
            const mentor_mentoring_skills_technologies = profile.mentor.mentoring_skills?.technologies ?? EMPTY_ARRAY;
            const mentor_mentoring_skills_industry_knowledge = profile.mentor?.mentoring_skills.industry_knowledge ?? EMPTY_ARRAY;
            const mentor_mentoring_skills_soft_skills = profile.mentor.mentoring_skills?.soft_skills ?? EMPTY_ARRAY;
            const mentor_mentoring_skills_tools = profile.mentor.mentoring_skills?.tools ?? EMPTY_ARRAY;
            const mentor_status = profile.mentor.status ?? EMPTY_STRING;
            const preferences_communication_modes = profile.preferences?.communication_modes ?? EMPTY_ARRAY;

            return {
                email_id,
                name,
                department,
                area_of_expertize,
                prof_experience,
                location,
                mentor_mentoring_skills_technologies,
                mentor_mentoring_skills_industry_knowledge,
                mentor_mentoring_skills_soft_skills,
                mentor_mentoring_skills_tools,
                mentor_status,
                preferences_communication_modes
            }
        } catch (error) {
            console.log('Error occurred while extracting dynamoDb fields for cloud search.');
            throw error;
        }
    }
}

module.exports = CloudSearchUtility;