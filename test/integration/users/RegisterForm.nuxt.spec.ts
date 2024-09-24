// @vitest-environment nuxt
import { it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { CpfBaseInputGroupTestSuite, EmailBaseInputGroupTestSuite, PasswordBaseInputGroupTestSuite, TelephoneBaseInputGroupTestSuite } from "../helpers/SignupFlow/ComponentsTestSuite";
import RegisterForm from "~/components/form/register/index.vue";

it(
  "Happy path: when inputting correct values, the form should submit successfully against the API",
  async () => {
    const wrapper = await mountSuspended(RegisterForm);

    await new EmailBaseInputGroupTestSuite(wrapper).setInput(EmailBaseInputGroupTestSuite.VALID_EMAIL);
    await new PasswordBaseInputGroupTestSuite(wrapper).setInput(PasswordBaseInputGroupTestSuite.VALID_EMAIL);
    await new CpfBaseInputGroupTestSuite(wrapper).setInput(CpfBaseInputGroupTestSuite.VALID_CPF);
    await new TelephoneBaseInputGroupTestSuite(wrapper).setInput(TelephoneBaseInputGroupTestSuite.VALID_EMAIL);

    const submitButton = await wrapper.find("#submit-signup-flow-form-button:not([disabled])");
    if (!submitButton || !submitButton.exists()) {
      throw new Error("An available submit button was not found");
    }

    await submitButton.trigger("click");
  },
);
