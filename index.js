const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mailjet = require('node-mailjet')
    .connect('06ca129968b9676119ed88c3123663c4', 'a145ac616dabb7981d0f2020ef6d3628');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const fs = require('fs');


const sendmail = async function (req, res, next) {
    let {
        username,
        surname,
        email,
        phone,
        isPartner
    } = req.body;
    const html = `<h2>NEW early access USER at  -  ${new Date()}</h2>

<table style=" border-collapse: collapse;
  width: 100%;">
    <tr>
        <th style="border: 2px solid #dddddd;">Name</th>
        <th style="border: 2px solid #dddddd;">Surname</th>
        <th style="border: 2px solid #dddddd;">Email</th>
        <th style="border: 2px solid #dddddd;">Phone</th>
        <th style="border: 2px solid #dddddd;">Is partner </th>
    </tr>
    <tr>
        <th style="border: 2px solid #dddddd;">${username ? username : ''}</th>
        <th style="border: 2px solid #dddddd;">${surname ? surname : ''}</th>
        <th style="border: 2px solid #dddddd;" >${email ? email : ''}</th>
        <th  style="border: 2px solid #dddddd;" >${phone ? phone : ''}</th>
        <th  style="border: 2px solid #dddddd;" >${isPartner ? isPartner : false}</th>
    </tr>

</table>
`;
    const request = await mailjet.post("send", {'version': 'v3.1'}).request({
        "Messages": [
            {
                "From": {
                    "Email": "universalservicetool@gmail.com",
                    "Name": "UST"
                },
                "To": [
                    {
                        "Email": "universalservicetool@gmail.com",
                        "Name": "UST"
                    }
                ],
                "Subject": `New early access user ${username ? username : ''}`,
                "TextPart": "New early access user",
                "HTMLPart": html,
                "CustomID": Date.now().toString()

            }
        ]
    });
    const success = request.response.body.Messages[0].Status === 'success';
    append(req.body);
    res.send({done: success});
};

async function append(obj) {
    const content = JSON.stringify(obj) + ',';
    fs.appendFile('reqs.json', content, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

app.post('/', sendmail);

app.listen(process.env.PORT | 3000, (err) => {
    if (!err)
        console.log(`Server is listening to ${process.env.PORT | 3000}`);
});
