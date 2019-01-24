const rp = require('request-promise')
const cheerio = require('cheerio')
const baseUrl = 'https://www.yellowpages.com'
const validUrl = require('valid-url')
const url = baseUrl + '/search?search_terms=printing+services&geo_location_terms=Los+Angeles%2C+CA'
var name, link, telephone, address, status = ""
const businessData = []

const getCompanies = async () => {
    const html = await rp(url)
    const $ = cheerio.load(html)
    $('a.business-name').each((i, elem) => {
        if (!validUrl.isUri(elem.attribs.href)) {
            link = baseUrl + elem.attribs.href
            if (elem.children[0].data == undefined) {
                name = elem.children[0].children[0].data
            } else {
                name = elem.children[0].data
            }
            businessData.push({ name, link, telephone })
        }
    })
    return businessData
}

const phone = async link => {
    const detailPlace = await rp(link)
    const $ = cheerio.load(detailPlace)
    telephone = $('p.phone')[0].children[0].data
    if (telephone === undefined)
        telephone = $('p.phone')[0].children[0].next.data
    if ($('h2.address')[0].children[0] !== undefined)
        address = $('h2.address')[0].children[0].data
    businessData.push({ telephone, address })
    return { address, telephone, status }
}

module.exports = {
    getCompanies,
    phone
}