"use client";

import { removeBudget, setBudget } from "@/lib/actions/set-budget";
import { SPENDING_CATEGORIES, SpendingCategory } from "@/lib/starling-types";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Budget } from "@prisma/client";
import { FormEventHandler, useEffect, useState } from "react";

export interface Props {
  budgets: Budget[];
  filterBy?: string;
}

const formatCategoryString = (c: string) => {
  return c
    .toLocaleLowerCase()
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const BudgetForm = ({ budgets, filterBy }: Props) => {
  const category = (filterBy as SpendingCategory) || "total";
  const existingBudget = budgets.find((b) => b.category === category);
  const categoryString = formatCategoryString(category);

  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [removeWarningOpen, setRemoveWarningOpen] = useState(false);
  const [amount, setAmount] = useState(existingBudget?.amount.toString() ?? "");
  const [selectedCategory, setSelectedCategory] = useState(category);

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
    });

    setBudgetModalOpen(false);
  };

  const onRemoveBudget = async () => {
    await removeBudget({ category });
    setRemoveWarningOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {existingBudget && (
          <Button onClick={() => setRemoveWarningOpen(true)}>
            Remove Budget
          </Button>
        )}
        <Button onClick={() => setBudgetModalOpen(true)}>
          {existingBudget ? "Update" : "Add"} Budget
        </Button>
      </div>
      <Modal
        isOpen={removeWarningOpen}
        onClose={() => setRemoveWarningOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Remove Budget</ModalHeader>
          <ModalBody>
            Are you sure you want to remove the budget for &quot;
            {categoryString}&quot;
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center justify-end gap-1">
              <Button onClick={() => setRemoveWarningOpen(false)}>No</Button>
              <Button color="danger" onClick={onRemoveBudget}>
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
                    label="Amount"
                  />
                </div>
                <Autocomplete
                  label="Category"
                  required
                  isRequired
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
