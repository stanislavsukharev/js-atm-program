const { page } = require("../po");

describe("Patients test suite", () => {
  beforeEach(async () => {
    await page("patients").open();
  });

  it("search patient", async () => {
    const searchPatient = await $("//input[@id='schedule_searchbar']");
    const magnifyingGlass = await $("//span[@id='schedule_searchbutton']");

    await searchPatient.customClick();
    await searchPatient.setValue("Mercy");
    await magnifyingGlass.customClick();

    const emailValidation = await $("//span[text()='Mercy']");
    expect(await emailValidation).toExist();
  });

  it("add new patient", async () => {
    await page("patients").patientsListHeader.addNewPatientButton.click();
    await page("patients")
      .addPatientsModal.input("name")
      .setValue("Mister Twister");
    await page("patients")
      .addPatientsModal.input("phone")
      .setValue("(333) 333-3333");
    await page("patients")
      .addPatientsModal.input("email")
      .setValue("mister@twister.com");
    await page("patients").addPatientsModal.saveButton.click();
    await expect(page("patients").addPatientsModal.rootEl).not.toBeDisplayed();
  });
});

describe("Calendar appointment test", () => {
  it("add appointment", async () => {
    await page("schedule").open();

    const appointment = await $('[data-date="1596340800000"]');
    const inputPatientName = await $("//input[@id='PatientName']");
    const symptomField = await $("//textarea[@name='Symptoms']");
    const saveAppointmentButton = await $(".e-event-save");

    await appointment.doubleClick();
    await inputPatientName.setValue("Milka");
    await symptomField.setValue("bipolar disorder");
    await saveAppointmentButton.customClick();

    const newAppointmentValidation = await $(
      "//div[@data-id='Appointment_1092']"
    );
    expect(await newAppointmentValidation).toExist();
  });
});

describe("Doctors test", () => {
  it("delete doctors entry", async () => {
    await page("doctors").open();

    const doctorsEntry = await $("//div[@id='Specialist_7']");
    const deleteDoctorButton = await $("//button[text()='Delete']");
    const deleteDoctorButtonOk = await $("//button[text()='Ok']");
    const doctorsButton = await $("//span[text()='Doctors']");

    await doctorsEntry.customClick();
    await deleteDoctorButton.customClick();
    await deleteDoctorButtonOk.customClick();
    await doctorsButton.customClick();

    const deletedEntryValidation = await $("//div[@id='Specialist_7']");
    expect(await deletedEntryValidation).not.toBeDisplayed();
  });
});
//TASK2 - Basic commands
describe("Basic commands doctors", () => {
  it("add new doctor", async () => {
    await page("doctors").open();

    const addNewDoctorButton = await $("//button[text()='Add New Doctor']");
    const addNewDoctorModalWindow = await $(".new-doctor-dialog");
    const inputDoctorName = await $("//input[@name='Name']");
    const inputMobileNumber = await $("//input[@id='DoctorMobile']");
    const inputEmail = await $("//input[@name='Email']");
    const saveButton = await $("//button[text()='Save']");

    await addNewDoctorButton.customClick();
    await addNewDoctorModalWindow.isDisplayed();
    await inputDoctorName.setValue("Wednesday Addams");
    await inputMobileNumber.setValue("(666) 666-6666");
    await inputEmail.setValue("wednesday@addams.com");
    await saveButton.customClick();

    const newDoctorEntryValidation = await $("//div[@id='Specialist_8']");
    expect(await newDoctorEntryValidation).toExist();
  });
});

describe("Basic commands calendar", () => {
  beforeEach(async () => {
    await page("schedule").open();
  });

  it("delete appointment", async () => {
    const appointment = await $("//div[@data-id='Appointment_1002']");
    const deleteButton = await $("//button[@title='Delete']");
    const deleteButtonConfirm = await $("//button[@aria-label='Delete']");

    await appointment.customClick();
    await deleteButton.customClick();
    await deleteButtonConfirm.customClick();

    const deletedAppointmentValidation = await $(
      "//div[@data-id='Appointment_1002']"
    );
    expect(await deletedAppointmentValidation).toExist();
  });

  it("add appointment", async () => {
    const appointment = await $('[data-date="1596686400000"]');
    const inputPatientName = await $("//input[@id='PatientName']");
    const symptomField = await $("//textarea[@name='Symptoms']");
    const saveAppointmentButton = await $(".e-event-save");

    await appointment.doubleClick();
    await inputPatientName.setValue("Adams");
    await symptomField.setValue("Schizophrenia");
    await saveAppointmentButton.customClick();

    const newAppointmentValidation = await $(
      "//div[@data-id='Appointment_1030']"
    );
    expect(await newAppointmentValidation).toExist();
  });
});

describe("Basic commands patients", () => {
  it("search patient", async () => {
    await page("patients").open();

    const searchPatient = await $("//input[@id='schedule_searchbar']");
    const magnifyingGlass = await $("//span[@id='schedule_searchbutton']");

    await searchPatient.customClick();
    await searchPatient.setValue("Maud");
    await searchPatient.addValue(" Oliver");
    await magnifyingGlass.customClick();

    const patientValidation = await $("//span[text()='Maud Oliver']");
    expect(await patientValidation).toBeClickable();
  });
});
// TASK3 - Advanced commands
describe("adding css style", () => {
  it("execute()", async () => {
    await page("dashboard").open();

    await browser.execute(function () {
      const element = document.querySelector(".clinic-name");
      element.style.color = "indigo";
      element.style.border = "orange solid 4px";
    });
    const newElementValidation = await $(
      "//h1[@style='color: indigo; border: 4px solid orange']"
    );
    expect(await newElementValidation).toExist();
  });
});

describe("progress bar semi circular", () => {
  it("waitUntil()", async () => {
    await page("semi").open();

    await $("#reLoad").customClick();
    await browser.waitUntil(
      async () => (await $("#point1").getText()) === "100%",
      {
        timeout: 7000,
        interval: 600,
        timeoutMsg: "not loaded",
      }
    );
    const pointValidation = await $("#point1");
    expect(await pointValidation.getText()).toEqual("100%");
  });
});

describe("actions", () => {
  it("mouse move", async () => {
    await page("patients").open();

    const firstRow = await $(
      "div.e-responsive-header table[role=grid] tbody tr:first-child"
    );
    await firstRow.moveTo();

    const focusValidation = await $(
      "div.e-responsive-header table[role=grid] tbody tr:first-child"
    );
    expect(await focusValidation.isFocused());
  });

  it("selecting multiple cells", async () => {
    await page("schedule").open();

    const slot1 = await $("[data-date='1596340800000']");
    const slot2 = await $("[data-date='1596342600000']");
    const SHIFT = "\uE008";
    await slot1.customClick();
    await browser.performActions([
      {
        type: "key",
        id: "keyboard",
        actions: [
          {
            type: "keyDown",
            value: SHIFT,
          },
        ],
      },
    ]);
    await slot2.customClick();
    await browser.pause(500);
    await browser.performActions([
      {
        type: "key",
        id: "keyboard",
        actions: [
          {
            type: "keyUp",
            value: SHIFT,
          },
        ],
      },
    ]);
    await browser.releaseActions();

    const slotValidationFirst = await $("[data-date='1596340800000']");
    expect(slotValidationFirst.isFocused());
    const slotValidationLast = await $("[data-date='1596342600000']");
    expect(slotValidationLast.isFocused());
  });
});

//bonus task
describe("set cookies", () => {
  it("setCookies()", async () => {
    await page("doctors").open();

    await browser.setCookies([
      {
        name: "helloIamTheCookie",
        value: "69",
      },
    ]);
    const testCookie = await browser.getCookies(["helloIamTheCookie"]);
    expect(await testCookie).toHaveValueContaining([
      {
        name: "helloIamTheCookie",
        value: "69",
      },
    ]);
  });
});
