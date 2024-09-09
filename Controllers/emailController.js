const db = require("../Config/dbConfig");
const { JSDOM } = require("jsdom");
const emailHandler = require("../Config/getEmailContent");

const dotenv = require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const generateUniqueToken = require("../Config/generateToken");
const createToken = require("../Config/generateJWTToken");
const { splitStringToArray } = require("../Config/getStringFromCSV");
const { csvStringToArray } = require("../Config/getArrayFromCSVString");

const sendEmail1 = (req, res) => {
  const {
    vehicleNo,
    PolicyNo,
    Insured,
    Date,
    leadId,
    toMail,
    type,
    BrokerMailAddress,
    GarageMailAddress,
    Region,
  } = req.body;

  if (leadId === undefined || !leadId) {
    res.status(400).send("LeadId is empty");
    return;
  }

  const sql = "SELECT * FROM ClaimStatus WHERE LeadId =?";
  db.query(sql, [leadId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    const content = emailHandler(result[0]?.Status);

    const InsuredToken = generateUniqueToken();
    const ImageToken = generateUniqueToken();
    const VideoToken = generateUniqueToken();

    const insertClaimDetails = `
          UPDATE ClaimDetails
          SET
          InsuredToken = '${InsuredToken}',
          ImageToken ='${ImageToken}',
          VideoToken ='${VideoToken}'
          WHERE LeadId = ${leadId};
        `;

    db.query(insertClaimDetails, (err, result2) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      const emailContent = `
      Dear Sir/Madam,<br/>
  
      Greeting from the MT Engineers Legal Investigator Pvt. Ltd., <br/>
  
      We are Appointed for the survey of vehicle no.${vehicleNo}, <br/>
      Insured:${Insured} & Policy No.-${PolicyNo} on ${Date} <br/>
      from the United India Insurance co. Ltd.<br/>
      So we request you please provide the complete contact <br/>
      deatils & mails of Repairer/insured. So that we <br/>
      can procedd further in your case and we also request <br/>
      you to provide the following details as follows:- <br/>
      <br/>
      <strong> ${content} </strong>

      Please provide the clear copy of all the documents so that <br/>
      the claim processing can be fast or
      <p><a href=https://cmsprod.vercel.app/documents/${leadId}?token=${InsuredToken}&type=${1}&content=${""} target="_blank">Click Here</a> to fill the documents information .</p> <br/>

      Please provide the clear Vahicle Videos so that the claim <br/>
      processing can be fast or 
      <p><a href=https://cmsprod.vercel.app/documents/${leadId}?token=${ImageToken}&type=${2}&content=${"Images"} target="_blank">Click Here</a> to fill the documents information .</p> <br/>

      Please provide the  all the clear Images of the Vehicle so  <br/>
      that the claim processing can be fast or 
      <p><a href=https://cmsprod.vercel.app/documents/${leadId}?token=${VideoToken}&type=${3}&content=${"Videos"} target="_blank">Click Here</a> to fill the documents information .</p> <br/>

    Note:- <strong> <br/>
      If We Cannot get the response with in 02 days we will inform the insurer that the insured is not interseted in the <br/>
      claim. So close the file as"No Claim" in non copperation & non submission of the documents. <br/></strong>

  `;

      const currentMailAddress =
        Region === "Delhi"
          ? process.env.NODEMAILER_DELHI_EMAIL
          : Region === "Jodhpur"
          ? process.env.NODEMAILER_JODHPUR_EMAIL
          : Region === "Jaipur"
          ? process.env.NODEMAILER_JAIPUR_EMAIL
          : Region === "Hero"
          ? process.env.NODEMAILER_HERO_EMAIL
          : process.env.NODEMAILER_CHANDIGARH_EMAIL;
      const currentMailAddressPass =
        Region === "Delhi"
          ? process.env.NODEMAILER_DELHI_EMAIL_PASSWORD
          : Region === "Jodhpur"
          ? process.env.NODEMAILER_JODHPUR_EMAIL_PASSWORD
          : Region === "Jaipur"
          ? process.env.NODEMAILER_JAIPUR_EMAIL_PASSWORD
          : Region === "Hero"
          ? process.env.NODEMAILER_HERO_EMAIL_PASSWORD
          : process.env.NODEMAILER_CHANDIGARH_EMAIL_PASSWORD;

      const transporter2 = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: currentMailAddress,
          pass: currentMailAddressPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const ccContent =
        GarageMailAddress && BrokerMailAddress
          ? `${GarageMailAddress},${BrokerMailAddress}`
          : GarageMailAddress
          ? GarageMailAddress
          : BrokerMailAddress;

      const mailOptions = {
        from: currentMailAddress,
        to: toMail,
        cc: ccContent,
        subject: `Survey Request for Claim of
          Vehicle Number - ${vehicleNo} A/c ${
          Insured ? Insured : "N.A."
        } policy Number - ${PolicyNo}`,
        html: emailContent,
      };

      // Send the email
      transporter2.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
        } else if (String(type) === "1") {
          console.log(type, String(type) === "1");

          const insertClaimDetails = `
            UPDATE ClaimDetails
            SET
            IsMailSent = 1
            WHERE LeadId = ${leadId};
          `;
          db.query(insertClaimDetails, (err, result2) => {
            if (err) {
              console.error(err);
              res.status(500).send("Internal Server Error");
              return;
            }
            res.status(200).send("Email sent successfully");
          });
        }
      });
    });
  });
};

const acknowledgmentMail = (req, res) => {
  const {
    vehicleNo,
    PolicyNo,
    Insured,
    Date,
    leadId,
    toMail,
    type,
    BrokerMailAddress,
    GarageMailAddress,
  } = req.body;
  const sql = "SELECT * FROM ClaimStatus WHERE LeadId =?";
  const sql1 = "SELECT Region FROM ClaimDetails WHERE LeadId =?";

  db.query(sql, [leadId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    db.query(sql1, [leadId], (err, resultRegion) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      const content = emailHandler(result[0]?.Status);
      const Region = resultRegion[0]?.Region; // Updated assignment for Region

      const InsuredToken = generateUniqueToken();
      const ImageToken = generateUniqueToken();
      const VideoToken = generateUniqueToken();

      const insertClaimDetails = `
            UPDATE ClaimDetails
            SET
            InsuredToken = '${InsuredToken}',
            ImageToken ='${ImageToken}',
            VideoToken ='${VideoToken}'
            WHERE LeadId = ${leadId};
          `;

      db.query(insertClaimDetails, (err, result2) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }

        const emailContent = `
            Dear Sir/Madam,<br/>
      
            Greeting from the MT Engineers Legal Investigator Pvt. Ltd., <br/>
      
            We are Appointed for the survey of vehicle no.${vehicleNo}, <br/>
            Insured:${Insured} & Policy No.-${PolicyNo} on ${Date} <br/>
            from the United India Insurance co. Ltd. So we request <br/>
            you please provide the complete contact deatils & mails of Repairer/insured.<br/>
            So that we  can procedd further in your case and we also request <br/>
            you to provide the following details as follows:- <br/>
      
            <strong>${content}</strong><br/>
      
            Please provide the clear copy of all the documents so that  <br/>
            the claim processing can be fast or <br/>
            <p><a href=https://cmsprod.vercel.app/documents/${leadId}?token=${InsuredToken}&type=${1}&content=${""} target="_blank">Click Here</a> to fill the documents information .</p> <br/>
      
            Please provide the clear Vahicle Videos so that the claim <br/>
            processing can be fast or <br/>
            <p><a href=https://cmsprod.vercel.app/documents/${leadId}?token=${ImageToken}&type=${2}&content=${"Images"} target="_blank">Click Here</a> to fill the documents information .</p> <br/>
      
            Please provide the  all the clear Images of the Vehicle so  <br/>
            that the claim processing can be fast or <br/>
            <p><a href=https://cmsprod.vercel.app/documents/${leadId}?token=${VideoToken}&type=${3}&content=${"Videos"} target="_blank">Click Here</a> to fill the documents information .</p> <br/>
      
          Note:- <strong> If We Cannot get the response with in 02 days we will inform the insurer that the insured <br/>
          is not interseted in the claim. So close the file as"No Claim" in non copperation & non submission of the documents. </strong> <br/>
      
    `;

        const currentMailAddress =
          Region === "Delhi"
            ? process.env.NODEMAILER_DELHI_EMAIL
            : Region === "Jodhpur"
            ? process.env.NODEMAILER_JODHPUR_EMAIL
            : Region === "Jaipur"
            ? process.env.NODEMAILER_JAIPUR_EMAIL
            : Region === "Hero"
            ? process.env.NODEMAILER_HERO_EMAIL
            : process.env.NODEMAILER_CHANDIGARH_EMAIL;
        const currentMailAddressPass =
          Region === "Delhi"
            ? process.env.NODEMAILER_DELHI_EMAIL_PASSWORD
            : Region === "Jodhpur"
            ? process.env.NODEMAILER_JODHPUR_EMAIL_PASSWORD
            : Region === "Jaipur"
            ? process.env.NODEMAILER_JAIPUR_EMAIL_PASSWORD
            : Region === "Hero"
            ? process.env.NODEMAILER_HERO_EMAIL_PASSWORD
            : process.env.NODEMAILER_CHANDIGARH_EMAIL_PASSWORD;

        const transporter2 = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: currentMailAddress,
            pass: currentMailAddressPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        const mailOptions = {
          from: currentMailAddress,
          to: toMail,
          cc: `${GarageMailAddress},${BrokerMailAddress}`,
          subject: `Survey Request for Claim of
            Vehicle Number - ${vehicleNo} A/c ${
            Insured ? Insured : "N.A."
          }  policy Number - ${PolicyNo}`,
          html: emailContent,
        };

        transporter2.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
          }
          const insertStatusDetails = `
              UPDATE ClaimDetails
              SET
              IsMailSent = 1
              WHERE LeadId = ${leadId};
            `;

          db.query(insertStatusDetails, (err, result2) => {
            if (err) {
              console.error(err);
              res.status(500).send("Internal Server Error");
              return;
            }
            res.status(200).send("Email sent successfully");
          });
        });
      });
    });
  });
};

const sendCustomEmail = (req, res) => {
  const {
    vehicleNo,
    PolicyNo,
    Insured,
    Date,
    content,
    content2,
    leadId,
    toMail,
    fromEmail,
    subject,
    body,
    Region,
  } = req.body;

  if (leadId === undefined || !leadId) {
    res.status(400).send("LeadId is empty");
    return;
  }

  const emailArray = csvStringToArray(toMail);

  const sql = "SELECT Token FROM ClaimDetails WHERE LeadId =?";
  db.query(sql, [leadId], (err, result2) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (!result2[0]?.Token) {
      const generatedToken = generateUniqueToken();
      const insertClaimDetails = `
        UPDATE ClaimDetails
        SET
        InsuredToken = '${generatedToken}'
        WHERE LeadId = ${leadId};
      `;
      db.query(insertClaimDetails, (err, result2) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }

        const emailContent = `
          ${body}
          <br/>
  
          <strong>${content}</strong>

          <br/>
    
          Please provide the clear copy of all the documents so that
          the claim processing can be fast or
          <p><a href=https://cmsprod.vercel.app/documents/${leadId}?token=${generatedToken}&type=${1}&content=${encodeURIComponent(
          content2
        )} target="_blank">Click Here</a> to fill the documents information .</p>
    
          <br/>
           Note:- 
            <strong>If We Cannot get the response with in 02 days we will 
              inform the insurer that the insured is not interseted in the claim. 
              So close the file as"No Claim" in non copperation & non submission
              of the documents. </strong>
          
        `;

        const mainEmail = emailArray.length > 0 ? emailArray[0] : "";
        const ccArray =
          emailArray.length > 2
            ? `${emailArray[1]},${emailArray[2]}`
            : emailArray.length > 1
            ? `${emailArray[1]}`
            : "";

        if (mainEmail) {
          const mailOptions = {
            from: fromEmail,
            to: mainEmail,
            cc: ccArray,
            subject: subject,
            html: emailContent,
          };

          const currentMailAddress =
            Region === "Delhi"
              ? process.env.NODEMAILER_DELHI_EMAIL
              : Region === "Jodhpur"
              ? process.env.NODEMAILER_JODHPUR_EMAIL
              : Region === "Jaipur"
              ? process.env.NODEMAILER_JAIPUR_EMAIL
              : Region === "Hero"
              ? process.env.NODEMAILER_HERO_EMAIL
              : process.env.NODEMAILER_CHANDIGARH_EMAIL;
          const currentMailAddressPass =
            Region === "Delhi"
              ? process.env.NODEMAILER_DELHI_EMAIL_PASSWORD
              : Region === "Jodhpur"
              ? process.env.NODEMAILER_JODHPUR_EMAIL_PASSWORD
              : Region === "Jaipur"
              ? process.env.NODEMAILER_JAIPUR_EMAIL_PASSWORD
              : Region === "Hero"
              ? process.env.NODEMAILER_HERO_EMAIL_PASSWORD
              : process.env.NODEMAILER_CHANDIGARH_EMAIL_PASSWORD;

          const transporter2 = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: currentMailAddress,
              pass: currentMailAddressPass,
            },
            tls: {
              rejectUnauthorized: false,
            },
          });

          transporter2.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(error);
              res.status(500).send("Internal Server Error");
            } else {
              console.log("Email sent: " + info.response);
              res.status(200).send("Email sent successfully");
            }
          });
        }
      });
    } else {
      const emailContent = `
        ${body}
        <br/>
  
        <strong>${content}</strong>

        <br/>
  
        Please provide the clear copy of all the documents so that
         the claim processing can be fast or
        <br/>

        <p><a href=https://cmsprod.vercel.app/documents/${leadId}?token=${
        result2[0].Token
      }&type=${1}&content=${encodeURIComponent(
        content2
      )} target="_blank">Click Here</a> to fill the documents information .</p>
  
        <br/>

        Note:- 
            <strong>If We Cannot get the response with in 02 days we will 
            inform the insurer that the insured is not interseted in the claim. 
            So close the file as"No Claim" in non copperation & non submission
            of the documents.</strong>
  
      `;

      emailArray.map((email, index) => {
        const mailOptions = {
          from: fromEmail,
          to: email,
          subject: subject,
          html: emailContent,
        };

        const currentMailAddress =
          Region === "Delhi"
            ? process.env.NODEMAILER_DELHI_EMAIL
            : Region === "Jodhpur"
            ? process.env.NODEMAILER_JODHPUR_EMAIL
            : Region === "Jaipur"
            ? process.env.NODEMAILER_JAIPUR_EMAIL
            : Region === "Hero"
            ? process.env.NODEMAILER_HERO_EMAIL
            : process.env.NODEMAILER_CHANDIGARH_EMAIL;
        const currentMailAddressPass =
          Region === "Delhi"
            ? process.env.NODEMAILER_DELHI_EMAIL_PASSWORD
            : Region === "Jodhpur"
            ? process.env.NODEMAILER_JODHPUR_EMAIL_PASSWORD
            : Region === "Jaipur"
            ? process.env.NODEMAILER_JAIPUR_EMAIL_PASSWORD
            : Region === "Hero"
            ? process.env.NODEMAILER_HERO_EMAIL_PASSWORD
            : process.env.NODEMAILER_CHANDIGARH_EMAIL_PASSWORD;

        const transporter2 = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: currentMailAddress,
            pass: currentMailAddressPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        transporter2.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
          } else {
            console.log("Email sent: " + info.response);
            res.status(200).send("Email sent successfully");
          }
        });
      });
    }
  });
};

const sendEmail2 = (req, res) => {
  //garage email
  const { vehicleNo, PolicyNo, Insured, toMail, Date, leadId } = req.body;

  const generatedToken = generateUniqueToken();

  const emailContent = `
      Dear Sir/Madam,<br/>
  
      Greeting from the MT Engineers Legal Investigator Pvt. Ltd.,
  
        We are Appointed for the survey of vehicle no.-${vehicleNo},
       Insured:-${Insured} & Policy No.-${PolicyNo} on ${Date} and 
       the approval is as follows:-<br/>
       <br/>
       Parts<br/>
       1) Fr Bumper- New Allowed<br/>
       2) FR Grill- New Allowed<br/>
       3) LH Head LIght- new Allowed<br/>
       4) LH Fender0- Repair Allowed<br/>
       <br/>
       Labour<br/>
       1) Fr Bumper- R/R-150, Painting-2500<br/>
       2) LH Head Light- R/R-100<br/>
       3) LH Fender- Denting-250, Painting-2200 <br/>
       
       Further approval will be provided after dismentaling of the vehicle.
           <p><a href=https://cmsprod.vercel.app/documents/${leadId}?token=${generatedToken}&content=${""} target="_blank">Click Here</a> to fill the documents information .</p>
  
       Note:- Pleasae consider that the the claim is payable  subject to 
        policy terms & conditions & Cashless facility will be allowed 
        Subject to all the documents get verified from online. 
        It is for your information please.
    `;

  const mailOptions = {
    from: "infosticstech@gmail.com",
    to: toMail,
    subject: "Survey Request for Vehicle Claim",
    html: emailContent,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
};

const sendEmail3 = (req, res) => {
  //
  const { vehicleNo, PolicyNo, Insured, toMail, Date, leadId } = req.body;

  const generatedToken = generateUniqueToken();

  const emailContent = `
      Dear Sir/Madam,<br/>
  
      Greeting from the MT Engineers Legal Investigator Pvt. Ltd.,
  
      We are Appointed for the survey of vehicle no.-${vehicleNo}, Insured:-${Insured} & Policy No.-${PolicyNo} on ${Date} and the approval
      is as follows:- <br/>
        1) What is the Status of the said vheicle
        2) How much time it will take to repair the vehicle
        3) Please provide UR & RI Snaps
        4) Invoice Bill duly signed & stamped of dealer
        5) Payment receipt duly signed & stamped of dealer
        6) Previous Year Policy
        7) Pan Card
        8) Please destorey the items properly in the RI, Otherwise we will treat the part is repaired

        <p><a href=https://cmsprod.vercel.app/documents/${leadId}?token=${generatedToken}&content=${""} target="_blank">Click Here</a> to fill the documents information .</p>
  
          
        Please provide the clear copy of all the documents so that the claim processing can be fast
    
    Note:- If We Cannot get the response with in 01 day we will inform the insurer that the insured is not interseted in the
            claim. So close the file as"No Claim" in non copperation & non submission of the documents. 
    `;

  const mailOptions = {
    from: "infosticstech@gmail.com",
    to: toMail,
    subject: "Survey Request for Vehicle Claim",
    html: emailContent,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
};

module.exports = {
  sendEmail1,
  sendEmail2,
  sendEmail3,
  sendCustomEmail,
  acknowledgmentMail,
};
