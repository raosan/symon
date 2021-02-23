/**********************************************************************************
 *                                                                                *
 *    Copyright (C) 2021  SYMON Contributors                                      *
 *                                                                                *
 *   This program is free software: you can redistribute it and/or modify         *
 *   it under the terms of the GNU Affero General Public License as published     *
 *   by the Free Software Foundation, either version 3 of the License, or         *
 *   (at your option) any later version.                                          *
 *                                                                                *
 *   This program is distributed in the hope that it will be useful,              *
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of               *
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                *
 *   GNU Affero General Public License for more details.                          *
 *                                                                                *
 *   You should have received a copy of the GNU Affero General Public License     *
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.       *
 *                                                                                *
 **********************************************************************************/

import React, { FC, useState } from "react";

import Button from "../../components/Button";
import Header from "../../components/Header";
import Input from "../../components/Input";
import Select from "../../components/Select";

export const Setup: FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <SetupView
      currentStep={currentStep}
      onSetupDatabase={() => setCurrentStep(2)}
      onCreateAccount={() => setCurrentStep(3)}
      onFinish={() => console.log("finish")}
    />
  );
};

export interface SetupViewProps {
  currentStep: number;
  onSetupDatabase(): void;
  onCreateAccount(): void;
  onFinish(): void;
}

export const SetupView: FC<SetupViewProps> = ({
  currentStep,
  onSetupDatabase,
  onCreateAccount,
  onFinish,
}) => (
  <div>
    <Header />
    <div className="container my-16 mx-auto flex space-x-6">
      <Stepper
        steps={[
          { number: 1, name: "Database Info" },
          { number: 2, name: "Create Account" },
          { number: 3, name: "Finish Setup" },
        ]}
        currentStep={currentStep}
      />
      {currentStep === 1 && <SetupDatabase onNext={onSetupDatabase} />}
      {currentStep === 2 && <CreateAccount onNext={onCreateAccount} />}
      {currentStep === 3 && <Finish onFinish={onFinish} />}
    </div>
  </div>
);

export interface StepperProps {
  steps: Array<{ number: number; name: string }>;
  currentStep: number;
}

export const Stepper: FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {steps.map(({ number, name }, index) => (
          <li key={number}>
            <div className="relative pb-8">
              {index < steps.length - 1 && (
                <span
                  className={`absolute top-4 left-4 -ml-px h-full w-px ${
                    index < currentStep - 1 ? "bg-black" : "bg-bw-light"
                  }`}
                  aria-hidden="true"
                ></span>
              )}
              <div
                className={`relative flex items-center space-x-3 ${
                  index < currentStep ? "text-black" : "text-bw-light"
                }`}
              >
                <div>
                  <span className="h-8 w-8 bg-white flex items-center justify-center">
                    {number}
                  </span>
                </div>
                <div
                  className={`min-w-0 flex-1 ${
                    index === currentStep - 1 ? "font-bold" : ""
                  }`}
                >
                  <p>{name}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export interface SetupDatabaseProps {
  onNext(): void;
}

export const SetupDatabase: FC<SetupDatabaseProps> = ({ onNext }) => (
  <form
    className="flex-1 bg-white shadow-lg rounded-lg max-w-xl border border-gray-100"
    onSubmit={e => {
      e.preventDefault();
      onNext();
    }}
  >
    <div className="w-10/12 mx-auto pt-10 pb-12">
      <div className="mb-3 font-bold">Let’s get started.</div>
      <div className="mb-6 font-light text-gray-500">
        First, please enter the database configuration.
      </div>
      <div className="flex justify-end items-center mb-4">
        <label
          htmlFor="database"
          className="block w-24 font-light text-gray-500 text-right pr-7"
        >
          Database
        </label>
        <div className="flex-1">
          <Select id="database" options={[{ value: "mysql", name: "MySQL" }]} />
        </div>
      </div>
      <div className="flex justify-end items-center mb-4">
        <label
          htmlFor="host"
          className="block w-24 font-light text-gray-500 text-right pr-7"
        >
          Host
        </label>
        <div className="flex-1">
          <Input id="host" />
        </div>
      </div>
      <div className="flex justify-end items-center mb-4">
        <label
          htmlFor="port"
          className="block w-24 font-light text-gray-500 text-right pr-7"
        >
          Port
        </label>
        <div className="flex-1">
          <Input id="port" />
        </div>
      </div>
      <div className="flex justify-end items-center mb-4">
        <label
          htmlFor="schema"
          className="block w-24 font-light text-gray-500 text-right pr-7"
        >
          Schema
        </label>
        <div className="flex-1">
          <Input id="schema" />
        </div>
      </div>
      <div className="flex justify-end items-center mb-4">
        <label
          htmlFor="user"
          className="block w-24 font-light text-gray-500 text-right pr-7"
        >
          User
        </label>
        <div className="flex-1">
          <Input id="user" />
        </div>
      </div>
      <div className="flex justify-end items-center mb-4">
        <label
          htmlFor="password"
          className="block w-24 font-light text-gray-500 text-right pr-7"
        >
          Password
        </label>
        <div className="flex-1">
          <Input id="password" type="password" />
        </div>
      </div>
      <div className="flex items-center justify-between ml-24 font-light text-gray-500 mb-2">
        <div className="flex items-center">
          <input
            id="drop-schema"
            type="checkbox"
            className="h-4 w-4 focus:ring-transparent text-bw border-gray-300 rounded"
          />
          <label htmlFor="drop-schema" className="ml-2 block text-sm">
            Drop existing schema
          </label>
        </div>
      </div>
      <div className="text-sm font-light text-gray-500 ml-24 mb-8 pl-6">
        All tables in the database will be dropped. Please backup before
        finishing this setup.
      </div>
      <div className="flex justify-end">
        <Button label="Next" type="submit" />
      </div>
    </div>
  </form>
);

export interface CreateAccountProps {
  onNext(): void;
}

export const CreateAccount: FC<CreateAccountProps> = ({ onNext }) => (
  <form
    className="flex-1 bg-white shadow-lg rounded-lg max-w-xl border border-gray-100"
    onSubmit={e => {
      e.preventDefault();
      onNext();
    }}
  >
    <div className="w-10/12 mx-auto pt-10 pb-12">
      <div className="mb-3 font-bold">Create account</div>
      <div className="mb-6 font-light text-gray-500">
        Let’s create an admin account.
      </div>
      <div className="flex justify-end items-center mb-4">
        <label
          htmlFor="username"
          className="block w-24 font-light text-gray-500 text-right pr-7"
        >
          Username
        </label>
        <div className="flex-1">
          <Input id="username" />
        </div>
      </div>
      <div className="flex justify-end items-center mb-4">
        <label
          htmlFor="email"
          className="block w-24 font-light text-gray-500 text-right pr-7"
        >
          Email
        </label>
        <div className="flex-1">
          <Input id="email" autoComplete="email" />
        </div>
      </div>
      <div className="flex justify-end items-center mb-12">
        <label
          htmlFor="password"
          className="block w-24 font-light text-gray-500 text-right pr-7"
        >
          Password
        </label>
        <div className="flex-1">
          <Input id="password" type="password" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button label="Next" type="submit" />
      </div>
    </div>
  </form>
);

export interface FinishProps {
  onFinish(): void;
}

export const Finish: FC<FinishProps> = ({ onFinish }) => (
  <div className="flex-1 bg-white shadow-lg rounded-lg max-w-xl border border-gray-100">
    <div className="w-10/12 mx-auto pt-10 pb-12">
      <div className="mb-3 font-bold">Finishing setup</div>
      <div className="mb-6 font-light text-gray-500">Please wait...</div>
      <div className="flex items-center mb-1 text-gray-500">
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="block ml-5">Connect to database</span>
      </div>
      <div className="flex items-center mb-1 text-gray-500">
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
        <span className="block ml-5">Drop tables</span>
      </div>
      <div className="flex items-center mb-1 text-gray-500">
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="block ml-5">Create tables</span>
      </div>
      <div className="flex items-center mb-1 text-gray-500">
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="block ml-5">Insert seed records</span>
      </div>
      <div className="flex items-center text-gray-500 mb-2">
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="block ml-5">Create configuration file</span>
      </div>
      <div className="text-bw ml-10 mb-12">
        <p className="mb-2">
          Configuration file is created in /home/user/.symon/symon.json
        </p>
        <p>
          To reconfigure Symon’s database connection, simply edit the file or
          remove (or rename) the file and restart symon server so the setup
          window will re-appear.
        </p>
      </div>
      <div className="flex justify-end">
        <Button label="Finish" onClick={onFinish} />
      </div>
    </div>
  </div>
);
