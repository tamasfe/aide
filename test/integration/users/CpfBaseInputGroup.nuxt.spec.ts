// @vitest-environment nuxt
import { expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import CpfBaseInputGroup from "~/components/form/register/CpfBaseInputGroup.vue";

it(
  "displays invalid cpf message when inputing a wrong CPF value",
  { timeout: 10000 },
  async () => {
    const component = await mountSuspended(CpfBaseInputGroup);
    const input = component.find("input[name=cpf]");

    input.element.nodeValue = "bla bla bla";

    console.log(component.html());
    expect(component.text()).includes("invalid_cpf");
  },
);
