


 const emailHandler=(val)=>{

    if(val === 1){
        return `
        1. Driving Licence <br/>
        2. Certificate of registration <br/>
        3. Repair Estimate <br/>
        4. Claim form <br/>
        5. Insurance policy <br/>
        6. Damage vehicle photographs/video <br/>
        7. Aadhar Card <br/>
        8. Pan Card <br/>
        9. Cancel Cheque <br/>
        10. Satisfaction voucher <br/>
        11. Previous year policy <br/>
        12. Preinspection (if break in insurance) <br/>
        13. NCB confirmation <br/>
        `
    }
    return '';
}
module.exports = emailHandler;