function doGet() {
  return HtmlService.createHtmlOutputFromFile('form.html')
    .setTitle('School Data Collection');
}

function getSchoolByUDISE(udise) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("School List");
  if (!sheet) return "";
  
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues(); // UDISE | School Name
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]) === String(udise)) {
      return values[i][1];
    }
  }
  return "";
}

function submitForm(formData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!/^[1-9][0-9]{9}$/.test(formData.udise)) {
    throw new Error("UDISE Code must be 10 digits and cannot start with 0.");
  }

  if (!/^[0-9]{10}$/.test(formData.mobile)) {
    throw new Error("Mobile number must be exactly 10 digits.");
  }

  const students = JSON.parse(formData.students);

  students.forEach((stu, i) => {
    if (!stu.student || !stu.father || !stu.class || !stu.sr) {
      throw new Error("All student fields in row " + (i + 1) + " are required.");
    }

    sheet.appendRow([
      new Date(),
      formData.udise,
      formData.school,
      formData.headmaster.toUpperCase(),
      formData.mobile,
      stu.student.toUpperCase(),
      stu.father.toUpperCase(),
      stu.class,
      Number(stu.sr)
    ]);
  });

  return "✅ Form submitted successfully!";
}
