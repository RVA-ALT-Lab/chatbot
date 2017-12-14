const AWS = require('aws-sdk')
const S3 = new AWS.S3({
    maxRetries: 0,
    region: 'us-east-1',
})

const getCourses = () => {
    return new Promise( (resolve, reject) => {
        S3.getObject({
            Bucket: 'vcu-online-chatbot',
            Key: 'online-courses.json'
        }, function (err, data){
            if (err !== null){
                reject(err)
            }
            resolve(JSON.parse(data.Body.toString('utf-8')))
        })
    })
}

const processRequest = (request, callback) => {

    const CourseType = request.currentIntent.slots.CourseType
    const StudentLevel = request.currentIntent.slots.StudentLevel


    getCourses().
    then( data => {
        let message
        let courses = data.data.filter(course => {
            return (course.subject_desc.toLowerCase().includes(CourseType))
        })

        if (!courses.length > 0){
            message = "Sorry, we couldn't find any courses in that discipline or at that level. Let me know if want me to look again for something else."
        } else {
            message = `We found ${courses.length} courses: \n
                ${courses.map(course => `${course.subject} ${course.course_number}-${course.section}: ${course.title}`).join('\n')}
            `
        }

        let response = {
            "dialogAction": {
                "type": "Close",
                "fulfillmentState": "Fulfilled",
                "message": {
                    "contentType": "PlainText",
                    "content": message
                }
            }
        }

        callback(null, response)


    }).catch(err => callback(err))

}


exports.handler = (event, context, callback) => {
    // TODO implement
    processRequest(event, callback);
};
