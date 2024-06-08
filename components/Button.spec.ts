import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import { Button } from "#components";

describe("components/Button.vue", () => {
  it("should render primary button", () => {
    const wrapper = mount(Button, {
      slots: {
        default: "Hello world",
      },
      props: {
        variant: "primary",
      },
    });
    expect(wrapper.text()).toContain("Hello world");
    expect(wrapper.classes()).toContain("text-button-primary");
    expect(wrapper.classes()).toContain("bg-button-primary");
  });

  it("should render secondary button", () => {
    const wrapper = mount(Button, {
      slots: {
        default: "Hello world",
      },
      props: {
        variant: "secondary",
      },
    });
    expect(wrapper.text()).toContain("Hello world");
    expect(wrapper.classes()).toContain("text-button-secondary");
    expect(wrapper.classes()).toContain("bg-button-secondary");
  });

  it("should render emphasis button", () => {
    const wrapper = mount(Button, {
      slots: {
        default: "Hello world",
      },
      props: {
        variant: "emphasis",
      },
    });
    expect(wrapper.text()).toContain("Hello world");
    expect(wrapper.classes()).toContain("text-button-emphasis");
    expect(wrapper.classes()).toContain("bg-button-emphasis");
  });

  it("should render big button", () => {
    const wrapper = mount(Button, {
      slots: {
        default: "Hello world",
      },
      props: {
        variant: "primary",
        big: true,
      },
    });
    expect(wrapper.classes()).toContain("p-button-big");
    expect(wrapper.classes()).toContain("font-bold");
  });

  it("should render shadow", () => {
    const primary = mount(Button, {
      slots: {
        default: "Hello world",
      },
      props: {
        variant: "primary",
        shadow: true,
      },
    });
    const emphasis = mount(Button, {
      slots: {
        default: "Hello world",
      },
      props: {
        variant: "emphasis",
        shadow: true,
      },
    });
    expect(primary.classes()).toContain("giro__shadow-3d-primary");
    expect(emphasis.classes()).toContain("giro__shadow-3d-emphasis");
  });

  it("renders with prefix and suffix slots", () => {
    const wrapper = mount(Button, {
      slots: {
        prefix: '<div class="prefix">Prefix</div>',
        default: "Click me",
        suffix: '<div class="suffix">Suffix</div>',
      },
      props: {
        variant: "primary",
      },
    });

    expect(wrapper.text()).toContain("Click me");

    const prefix = wrapper.find(".prefix");
    expect(prefix.exists()).toBe(true);
    expect(prefix.text()).toContain("Prefix");

    const suffix = wrapper.find(".suffix");
    expect(suffix.exists()).toBe(true);
    expect(suffix.text()).toContain("Suffix");
  });

  it("emits click event", () => {
    const wrapper = mount(Button, {
      slots: {
        default: "Click me",
      },
      props: {
        variant: "primary",
      },
    });

    wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
  });
});
