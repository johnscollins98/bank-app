"use client";

import {
  UserSettingsDto,
  UserSettingsSchema,
} from "@/lib/actions/user-settings/dtos";
import setUserSettings from "@/lib/actions/user-settings/set-user-settings";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { MonthBarrierOption } from "@prisma/client";
import Link from "next/link";
import { FormEventHandler, useEffect, useMemo, useState } from "react";
import { CgArrowLeft } from "react-icons/cg";

export const SettingsForm = ({
  userSettings,
}: {
  userSettings?: UserSettingsDto | null;
}) => {
  const [day, setDay] = useState(userSettings?.day?.toString() ?? "");
  const [monthBarrierOption, setMonthBarrierOption] =
    useState<MonthBarrierOption>(
      userSettings?.monthBarrierOption ?? "CALENDAR",
    );

  const settingsToSave = useMemo(
    () => ({
      day: parseFloat(day),
      monthBarrierOption,
    }),
    [day, monthBarrierOption],
  );

  const validation = useMemo(
    () => UserSettingsSchema.safeParse(settingsToSave),
    [settingsToSave],
  );

  useEffect(() => {
    if (
      settingsToSave.monthBarrierOption === "LAST" &&
      (settingsToSave.day > 7 || settingsToSave.day < 1)
    ) {
      setDay("");
    }
  }, [settingsToSave]);

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (validation.success) {
      await setUserSettings(settingsToSave);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
      Please enter your settings
      <Select
        label="Calendar Style"
        selectedKeys={[monthBarrierOption]}
        isInvalid={
          !!validation.error?.formErrors.fieldErrors.monthBarrierOption
        }
        errorMessage={
          validation.error?.formErrors.fieldErrors.monthBarrierOption
        }
        onChange={(e) =>
          setMonthBarrierOption(e.target.value as MonthBarrierOption)
        }
      >
        <SelectItem key="CALENDAR">Calendar</SelectItem>
        <SelectItem key="LAST">Last Day</SelectItem>
      </Select>
      {monthBarrierOption === "CALENDAR" && (
        <Input
          isRequired
          label="Day"
          value={day}
          isInvalid={
            day != "" && !!validation.error?.formErrors.fieldErrors.day
          }
          errorMessage={validation.error?.formErrors.fieldErrors.day}
          onChange={(e) => setDay(e.target.value)}
        />
      )}
      {monthBarrierOption === "LAST" && (
        <Select
          label="Day"
          selectedKeys={day}
          onChange={(e) => setDay(e.target.value)}
          isRequired
        >
          <SelectItem key="1">Monday</SelectItem>
          <SelectItem key="2">Tuesday</SelectItem>
          <SelectItem key="3">Wednesday</SelectItem>
          <SelectItem key="4">Thursday</SelectItem>
          <SelectItem key="5">Friday</SelectItem>
          <SelectItem key="6">Saturday</SelectItem>
          <SelectItem key="7">Sunday</SelectItem>
        </Select>
      )}
      <div className="flex items-center gap-2">
        <Button as={Link} href="/" className="flex gap-2">
          <CgArrowLeft />
          Home Page
        </Button>
        <Button type="submit" color="primary" isDisabled={!validation.success}>
          Submit
        </Button>
      </div>
    </form>
  );
};
