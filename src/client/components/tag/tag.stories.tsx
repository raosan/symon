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

import { Story, Meta } from "@storybook/react";
import Tag, { tagProps } from ".";

export default {
  title: "Tag",
  component: Tag,
  argTypes: {
    type: {
      control: {
        type: "radio",
        options: ["success", "info", "warn", "error"],
      },
    },
  },
} as Meta;

const Template: Story<tagProps> = args => <Tag {...args}>{args.children}</Tag>;

export const Default = Template.bind({});
Default.args = {
  children: "Default",
};
export const Success = Template.bind({});
Success.args = {
  children: "Success",
  type: "success",
};
export const Info = Template.bind({});
Info.args = {
  children: "Info",
  type: "info",
};
export const Warn = Template.bind({});
Warn.args = {
  children: "Warn",
  type: "warn",
};
export const Error = Template.bind({});
Error.args = {
  children: "Error",
  type: "error",
};
