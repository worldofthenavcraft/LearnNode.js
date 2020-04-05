const http = require('https')
const fs = require('fs')
const path = require('path')
const csvjson =require('csvjson')

//1. Download url as stream
//2. Convert file to json
//3. Save file to pwd

const downloadPage = (url='https://courses.edx.org/assets/courseware/v1/07d100219da1a726dad5eddb090fa215/asset-v1:Microsoft+DEV283x+3T2018+type@asset+block/customer-data.csv') => {
  console.log('downloading ', url)
  const fetchPage = (urlF, callback) => {
    http.get(urlF, (response) => {
      let buff = ''
      response.on('data', (chunk) => { 
        buff += chunk
      })
      response.on('end', () => {
        callback(null, buff)
      })
    }).on('error', (error) => {
      console.error(`Got error: ${error.message}`)
      callback(error)
    })
  }
    const folderName = 'data'
    if (!fs.existsSync(folderName)){
        fs.mkdirSync(folderName);
    }
    fetchPage(url, (error,data) => {
        if (error) return console.log(error) 
        fs.writeFileSync(path.join(__dirname, folderName, 'file.csv'), data)
        console.log('downloading is done in folder ', folderName)
        
        var read = fs.createReadStream(path.join(folderName, 'file.csv'));
        var write = fs.createWriteStream(path.join(folderName, 'customer-data.json'));
        var toObject = csvjson.stream.toObject();
        var stringify = csvjson.stream.stringify();
        read.pipe(toObject).pipe(stringify).pipe(write);

        console.log('Converting to json is done in folder ', folderName)

    })
}

downloadPage(process.argv[2])
