import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import { BaseInputWrapper } from "#components";

describe("components/BaseInputWrapper.vue", () => {
  it("should render input wrapper with title", () => {
    const wrapper = mount(BaseInputWrapper, {
      slots: {
        default: "<input />",
      },
      props: {
        title: "Title",
      },
    });
    expect(wrapper.text()).toContain("Title");
    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("should render title as placeholder", () => {
    const wrapper = mount(BaseInputWrapper, {
      slots: {
        default: "<input />",
      },
      props: {
        title: "Title",
      },
    });
    // check if title has class giro__input-placeholder
    expect(wrapper.find(".giro__input-placeholder").exists()).toBe(true);
  });

  it("should render title as label", () => {
    const wrapper = mount(BaseInputWrapper, {
      slots: {
        default: "<input />",
      },
      props: {
        title: "Title",
        modelValue: "Model value",
      },
    });
    // check if title has class giro__input-label-position
    expect(wrapper.find(".giro__input-label-position").exists()).toBe(true);
  });

  it("should render input wrapper with custom class", () => {
    const inputWrapper = mount(BaseInputWrapper, {
      slots: {
        default: "<input />",
      },
      props: {
        wrapperClass: "custom-class",
      },
    });
    const child = inputWrapper.element.children[0];
    expect(child.classList.contains("custom-class")).toBe(true);
  });

  it("should emit focus event on click", async () => {
    const wrapper = mount(BaseInputWrapper, {
      slots: {
        default: "<input />",
      },
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted("focus")).toBeTruthy();
  });

  it("should emit prefix slot", () => {
    const wrapper = mount(BaseInputWrapper, {
      slots: {
        prefix: "<div class=\"prefix\">Prefix</div>",
        default: "<input />",
      },
    });

    const prefix = wrapper.find(".prefix");
    expect(prefix.exists()).toBe(true);
    expect(prefix.text()).toContain("Prefix");
  });

  it("should emit suffix slot", () => {
    const wrapper = mount(BaseInputWrapper, {
      slots: {
        suffix: "<div class=\"suffix\">Suffix</div>",
        default: "<input />",
      },
    });

    const suffix = wrapper.find(".suffix");
    expect(suffix.exists()).toBe(true);
    expect(suffix.text()).toContain("Suffix");
  });
});
