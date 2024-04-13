require("dotenv").config();
const mysql = require("mysql2");
const { promisify } = require("util");
const cron = require("node-cron");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

let query = promisify(connection.query).bind(connection);

try {
  connection.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
    // now we can start cron
    task.start();
  });
} catch (error) {
  console.log("error", error);
}

var task = cron.schedule("*/1 * * * * *", async () => {
  console.log("cron runing");
  const newInvestArr = await findNewInvestment();
  console.log(newInvestArr.length);
  const sys_date = new Date().toISOString().slice(0, 10);
  newInvestArr.forEach(async (row) => {
    try {
      await updateTblMember(row);
      await updateTblStake(row);
      const memberUserId = row.member_user_id;
      const investPackage = row.investment;
      const transactionId = row.transaction_id;
      const spnacerId = await findSponcerId(row.member_user_id);
      const sponcerName = await findMemberName(row.member_user_id);
      await updateDirectBusiness(spnacerId, investPackage);
      await updateFirstLevel(
        memberUserId,
        spnacerId,
        sponcerName,
        investPackage,
        transactionId,
        sys_date
      );
      console.log("updated 1st level");

      await updateSecondLevel(
        memberUserId,
        spnacerId,
        sponcerName,
        investPackage,
        transactionId,
        sys_date
      );
      console.log("updated 2nd level");
      await updateThirdLevel(
        memberUserId,
        spnacerId,
        sponcerName,
        investPackage,
        transactionId,
        sys_date
      );
      console.log("updated 3nd level");
      await updateFourthLevel(
        memberUserId,
        spnacerId,
        sponcerName,
        investPackage,
        transactionId,
        sys_date
      );
      console.log("updated 4rth level");
      await updateFifthLevel(
        memberUserId,
        spnacerId,
        sponcerName,
        investPackage,
        transactionId,
        sys_date
      );
      console.log("updated 4rth level");
    } catch (error) {
      console.log(error);
    }
  });
});

const updateDirectBusiness = async (spnacerId, investPackage) => {
  try {
    let UPDATESp = `UPDATE tbl_memberreg set direct_business=direct_business+${investPackage} WHERE member_user_id='${spnacerId}'`;
    await query(UPDATESp);
  } catch (error) {
    console.log(error);
  }
};

const updateFirstLevel = async (
  memberUserId,
  spnacerId,
  sponcerName,
  investPackage,
  transactionId,
  sys_date
) => {
  try {
    const strSD = `SELECT member_name FROM tbl_memberreg WHERE member_user_id='${spnacerId}' AND status=1 AND topup_amount>0`;
    const resSd = await query(strSD);
    if (resSd.length > 0) {
      let income_amt = (investPackage * 8) / 100;
      await InsertIncomeTbl(
        memberUserId,
        spnacerId,
        sponcerName,
        investPackage,
        transactionId,
        income_amt,
        1,
        8,
        sys_date
      );
      await updateEarnigTbl(income_amt, spnacerId);
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

const updateSecondLevel = async (
  memberUserId,
  spnacerId,
  sponcerName,
  investPackage,
  transactionId,
  sys_date
) => {
  spnacerId = await findSponcerId(spnacerId);
  sponcerName = await findMemberName(spnacerId);
  const resSd = await selectMemberName(spnacerId, 2);
  if (resSd.length > 0) {
    let income_amt = (investPackage * 3) / 100;
    await InsertIncomeTbl(
      memberUserId,
      spnacerId,
      sponcerName,
      investPackage,
      transactionId,
      income_amt,
      2,
      3,
      sys_date
    );
    await updateEarnigTbl(income_amt, spnacerId);
    return;
  }
};

const updateThirdLevel = async (
  memberUserId,
  spnacerId,
  sponcerName,
  investPackage,
  transactionId,
  sys_date
) => {
  spnacerId = await findSponcerId(spnacerId);
  spnacerId = await findSponcerId(spnacerId);
  sponcerName = await findMemberName(spnacerId);
  const resSd = await selectMemberName(spnacerId, 3);
  if (resSd.length > 0) {
    let income_amt = (investPackage * 2) / 100;
    await InsertIncomeTbl(
      memberUserId,
      spnacerId,
      sponcerName,
      investPackage,
      transactionId,
      income_amt,
      3,
      2,
      sys_date
    );
    await updateEarnigTbl(income_amt, spnacerId);
    return;
  }
};

const updateFourthLevel = async (
  memberUserId,
  spnacerId,
  sponcerName,
  investPackage,
  transactionId,
  sys_date
) => {
  spnacerId = await findSponcerId(spnacerId);
  spnacerId = await findSponcerId(spnacerId);
  spnacerId = await findSponcerId(spnacerId);
  sponcerName = await findMemberName(spnacerId);
  const resSd = await selectMemberName(spnacerId, 4);
  if (resSd.length > 0) {
    let income_amt = (investPackage * 1) / 100;
    await InsertIncomeTbl(
      memberUserId,
      spnacerId,
      sponcerName,
      investPackage,
      transactionId,
      income_amt,
      4,
      1,
      sys_date
    );
    await updateEarnigTbl(income_amt, spnacerId);
    return;
  }
};

const updateFifthLevel = async (
  memberUserId,
  spnacerId,
  sponcerName,
  investPackage,
  transactionId,
  sys_date
) => {
  spnacerId = await findSponcerId(spnacerId);
  spnacerId = await findSponcerId(spnacerId);
  spnacerId = await findSponcerId(spnacerId);
  spnacerId = await findSponcerId(spnacerId);
  sponcerName = await findMemberName(spnacerId);
  const resSd = await selectMemberName(spnacerId, 5);
  if (resSd.length > 0) {
    let income_amt = (investPackage * 0.5) / 100;
    await InsertIncomeTbl(
      memberUserId,
      spnacerId,
      sponcerName,
      investPackage,
      transactionId,
      income_amt,
      5,
      0.5,
      sys_date
    );
    await updateEarnigTbl(income_amt, spnacerId);
    return;
  }
};
const afterFifth = async (
  memberUserId,
  spnacerId,
  sponcerName,
  investPackage,
  transactionId,
  sys_date
) => {
  spnacerId = await findSponcerId(spnacerId);
  spnacerId = await findSponcerId(spnacerId);
  spnacerId = await findSponcerId(spnacerId);
  spnacerId = await findSponcerId(spnacerId);
  spnacerId = await findSponcerId(spnacerId);
  sponcerName = await findMemberName(spnacerId);
  let resSd = await selectMemberName(spnacerId, 6);
  if (resSd.length > 0) {
    let income_amt = (investPackage * 0.5) / 100;
    await InsertIncomeTbl(
      memberUserId,
      spnacerId,
      sponcerName,
      investPackage,
      transactionId,
      income_amt,
      6,
      0.5,
      sys_date
    );
    await updateEarnigTbl(income_amt, spnacerId);
    spnacerId = await findSponcerId(spnacerId);
    sponcerName = await findMemberName(spnacerId);
    resSd = await selectMemberName(spnacerId, 7);
    if (resSd.length > 0) {
      let income_amt = (investPackage * 0.5) / 100;
      await InsertIncomeTbl(
        memberUserId,
        spnacerId,
        sponcerName,
        investPackage,
        transactionId,
        income_amt,
        7,
        0.5,
        sys_date
      );
    }
    await updateEarnigTbl(income_amt, spnacerId);
    spnacerId = await findSponcerId(spnacerId);
    sponcerName = await findMemberName(spnacerId);
    resSd = await selectMemberName(spnacerId, 8);
    if (resSd.length > 0) {
      let income_amt = (investPackage * 0.5) / 100;
      await InsertIncomeTbl(
        memberUserId,
        spnacerId,
        sponcerName,
        investPackage,
        transactionId,
        income_amt,
        8,
        0.5,
        sys_date
      );
    }
    await updateEarnigTbl(income_amt, spnacerId);
    spnacerId = await findSponcerId(spnacerId);
    sponcerName = await findMemberName(spnacerId);
    resSd = await selectMemberName(spnacerId, 9);
    if (resSd.length > 0) {
      let income_amt = (investPackage * 0.5) / 100;
      await InsertIncomeTbl(
        memberUserId,
        spnacerId,
        sponcerName,
        investPackage,
        transactionId,
        income_amt,
        9,
        0.5,
        sys_date
      );
    }
    await updateEarnigTbl(income_amt, spnacerId);
    spnacerId = await findSponcerId(spnacerId);
    sponcerName = await findMemberName(spnacerId);
    resSd = await selectMemberName(spnacerId, 10);
    if (resSd.length > 0) {
      let income_amt = (investPackage * 0.5) / 100;
      await InsertIncomeTbl(
        memberUserId,
        spnacerId,
        sponcerName,
        investPackage,
        transactionId,
        income_amt,
        10,
        0.5,
        sys_date
      );
    }
    await updateEarnigTbl(income_amt, spnacerId);
    return;
  }
};

const selectMemberName = async (spnacerId, direct) => {
  const strSD = `SELECT member_name from tbl_memberreg WHERE member_user_id='${spnacerId}'and status=1 and topup_amount>0 and direct_member>='${direct}'`;
  const resSd = await query(strSD);
  return resSd;
};

// updating earning table

const updateEarnigTbl = async (income_amt, spnacerId) => {
  try {
    const up = `UPDATE tbl_memberreg SET total_earning=total_earning+${income_amt} WHERE member_user_id='${spnacerId}'`;
    await query(up);
    return;
  } catch (error) {
    console.log(error);
  }
};

// this function insert  level(investment)

const InsertIncomeTbl = async (
  memberUserId,
  spnacerId,
  sponcerName,
  investPackage,
  transactionId,
  income_amt,
  level,
  percent,
  sys_date
) => {
  try {
    const str_in = `INSERT INTO tbl_member_income_dtails(member_user_id, member_name, calculate_date, income_amt, income_level, income_type, b_type, income_member_id, net_amt, hash_code, investment_amt, invest_type, income_per)  VALUES('${spnacerId}', '${sponcerName}', '${sys_date}', ${income_amt}, ${level}, 'DIRECT BONUS', 'DIRECT BONUS', '${memberUserId}', ${income_amt}, '${transactionId}', ${investPackage}, '', ${percent})`;
    await query(str_in);
  } catch (error) {
    console.log(error);
  }
};

// this function will find new stackings(investment)

const findNewInvestment = async () => {
  try {
    const newInvestQuery = `SELECT * FROM tbl_stake WHERE checked = 0 AND status = 1 ORDER BY record_no LIMIT 0,10`;
    const newInvestArr = await query(newInvestQuery);
    return newInvestArr;
  } catch (error) {
    console.log(error);
  }
  //Status 1 -> User Registered
};

// this function will find sponcer id of user

const findSponcerId = async (memberUserId) => {
  try {
    let strSD = `SELECT sponcer_id from tbl_memberreg WHERE member_user_id='${memberUserId}'`;
    const result = await query(strSD);
    if (result.length > 0) {
      return result[0].sponcer_id;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
  }
};

// this function will find sponcer id of user

const findMemberName = async (memberUserId) => {
  try {
    let strSD = `SELECT member_name from tbl_memberreg WHERE member_user_id='${memberUserId}'`;
    const result = await query(strSD);
    if (result.length > 0) {
      return result[0].member_name;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
  }
};

// this function will update the table which

const updateTblStake = async (rowR) => {
  try {
    const record_no = rowR.record_no;
    const upL = `UPDATE tbl_stake SET checked=1 WHERE record_no=${record_no}`; //Setting level as 1
    await query(upL);
    console.log("UPL done");
  } catch (error) {
    console.log(error);
  }
};

//This Function will update investment into member table

const updateTblMember = async (rowR) => {
  try {
    const member_user_id = rowR.member_user_id;
    const invest_package = rowR.investment;
    let UpB = `UPDATE tbl_memberreg set topup_amount=topup_amount+${invest_package},current_investment=current_investment+${invest_package},status=1 WHERE member_user_id='${member_user_id}'`;
    await query(UpB);
    console.log("tbl_memberreg UPDATE done");
  } catch (error) {
    console.log(error);
  }
};
