const logic = require('../scarping')
const InformationSchema = require('../schema/informationSchema')

module.exports = server => {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    server.route({
        method: 'POST',
        path: '/',
        handler: async () => {
            const data = await logic.getCompanies()
            await data.forEach(res => {
                const newModel = new InformationSchema(res)
                newModel.save()
            })
            // wait mongo create
            await sleep(5000)
            // add phone number
            const informationList = await InformationSchema.find()
            informationList.forEach(async eachInformation => {
                await logic.phone(eachInformation.link).then(async res => {
                    await InformationSchema.findOneAndUpdate({
                        _id: eachInformation._id
                    },
                        {
                            $set: {
                                phone: res.telephone,
                                address: res.address,
                                open_today: res.openToday,
                                open_tomorrow: res.openTomorrow
                            }
                        }
                    ).catch(err => { console.log(err) })
                }).catch(err => { console.log(err) })
            })
            return 'hello world'
        }
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: async () => {
            const information = await InformationSchema
                .find()
                .select({ __v: 0 })
                .catch(err => { console.log(err) })
            return information
        }
    })

    server.route({
        method: 'DELETE',
        path: '/',
        handler: async () => {
            return InformationSchema.deleteMany()
        }
    })
}