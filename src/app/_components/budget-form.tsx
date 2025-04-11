"use client";

import { removeBudget, setBudget } from "@/lib/actions/set-budget";
import { SPENDING_CATEGORIES, SpendingCategory } from "@/lib/starling-types";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Budget } from "@prisma/client";
import { FormEventHandler, useEffect, useState } from "react";

export interface Props {
  budgets: (Budget & { isOverride?: boolean })[];
  filterBy: string | null;
  startDate: Date;
}

const formatCategoryString = (c: string) => {
  return c
    .toLocaleLowerCase()
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const BudgetForm = ({ budgets, filterBy, startDate }: Props) => {
  const category = (filterBy as SpendingCategory) || "total";
  const existingBudget = budgets.find((b) => b.category === category);
  const categoryString = formatCategoryString(category);

  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [removeWarningOpen, setRemoveWarningOpen] = useState(false);
  const [amount, setAmount] = useState(existingBudget?.amount.toString() ?? "");
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [singleMonthOnly, setSingleMonthOnly] = useState(false);

  useEffect(() => {
    setAmount(existingBudget?.amount.toString() ?? "");
  }, [existingBudget]);

  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);

  const setBudgetSubmitHandler: FormEventHandler<HTMLFormElement> = async (
    e,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    await setBudget({
      amount: parseFloat(amount),
      category: selectedCategory,
      date: singleMonthOnly ? startDate : undefined,
    });

    setBudgetModalOpen(false);
  };

  const onRemoveBudget = async () => {
    await removeBudget({
      category,
      date: startDate,
    });
    setRemoveWarningOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {existingBudget && (
          <Button onPress={() => setRemoveWarningOpen(true)}>
            {existingBudget?.isOverride ? "Use Default" : "Remove"} Budget
          </Button>
        )}
        <Button onPress={() => setBudgetModalOpen(true)}>
          {existingBudget ? "Update" : "Add"} Budget
        </Button>
      </div>
      <Modal
        isOpen={removeWarningOpen}
        onClose={() => setRemoveWarningOpen(false)}
      >
        <ModalContent>
          <ModalHeader>
            {existingBudget?.isOverride ? "Use Default" : "Remove"} Budget
          </ModalHeader>
          <ModalBody>
            Are you sure you want to{" "}
            {existingBudget?.isOverride ? "use the default" : "remove the"}{" "}
            budget for &quot;
            {categoryString}&quot;
            {existingBudget?.isOverride && " in this month"}?
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center justify-end gap-1">
              <Button onPress={() => setRemoveWarningOpen(false)}>No</Button>
              <Button color="danger" onPress={onRemoveBudget}>
                Yes
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={budgetModalOpen} onClose={() => setBudgetModalOpen(false)}>
        <ModalContent>
          <form
            onSubmit={setBudgetSubmitHandler}
            onReset={() => setBudgetModalOpen(false)}
          >
            <ModalHeader>
              Set Budget for &quot;{categoryString}&quot;
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1">
                  £
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    isRequired
                    required
                    size="lg"
                    label="Amount"
                  />
                </div>
                <Autocomplete
                  label="Category"
                  required
                  isRequired
                  size="lg"
                  selectedKey={selectedCategory}
                  onSelectionChange={(v) =>
                    setSelectedCategory(v as SpendingCategory)
                  }
                >
                  {[...SPENDING_CATEGORIES, "total"].map((c) => (
                    <AutocompleteItem value={c} key={c}>
                      {formatCategoryString(c)}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <div className="flex gap-2">
                  <label htmlFor="single-month">
                    Override for this month only:
                  </label>
                  <Checkbox
                    name="single-month"
                    id="single-month"
                    isSelected={singleMonthOnly}
                    onValueChange={setSingleMonthOnly}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type="reset">Cancel</Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
