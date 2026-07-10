"use client";

import * as React from "react";
import { Dropdown } from "@heroui/react/dropdown";

import { cn } from "@/lib/utils";

type AppDropdownItem = {
  key: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  tone?: "default" | "danger";
  selected?: boolean;
  onSelect?: () => void;
};

type AppDropdownProps = {
  trigger: React.ReactNode;
  label: string;
  items: AppDropdownItem[];
  placement?: "bottom" | "bottom start" | "bottom end" | "top" | "top start" | "top end";
  triggerClassName?: string;
};

function AppDropdown({ trigger, label, items, placement = "bottom end", triggerClassName }: AppDropdownProps) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger className={cn("outline-none", triggerClassName)} aria-label={label}>
        {trigger}
      </Dropdown.Trigger>
      <Dropdown.Popover
        placement={placement}
        className="ktr-dropdown-popover z-50 min-w-[184px] rounded-[16px] border border-ktr-border-light bg-ktr-surface-card p-1 outline-none"
      >
        <Dropdown.Menu
          aria-label={label}
          className="outline-none"
          onAction={(key) => items.find((item) => item.key === String(key))?.onSelect?.()}
        >
          {items.map((item) => (
            <Dropdown.Item
              key={item.key}
              id={item.key}
              textValue={typeof item.label === "string" ? item.label : item.key}
              className={cn(
                "flex cursor-pointer flex-col rounded-[12px] px-3 py-2 text-[14px] font-medium leading-[22px] outline-none transition-colors",
                item.selected
                  ? "bg-ktr-primary text-ktr-text-white"
                  : item.tone === "danger"
                    ? "text-ktr-project-need-attention hover:bg-ktr-project-need-attention-bg focus:bg-ktr-project-need-attention-bg"
                    : "text-ktr-text-primary hover:bg-ktr-primary-soft focus:bg-ktr-primary-soft"
              )}
            >
              <span>{item.label}</span>
              {item.description ? <span className={cn("text-[12px] font-normal leading-[18px]", item.selected ? "text-ktr-text-white/80" : "text-ktr-text-tertiary")}>{item.description}</span> : null}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  );
}

export { AppDropdown };
export type { AppDropdownItem, AppDropdownProps };