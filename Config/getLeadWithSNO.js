function getLeadBYSNO(allLeads,SNO){
    let finedSNO = false;
    allLeads?.map((lead,index)=>{
        if(String(lead.SNO) === String(SNO)){
            finedSNO = true;
        }
    })
    return finedSNO;
}

module.exports = getLeadBYSNO;