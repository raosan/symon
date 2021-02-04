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

import { Story, Meta } from "@storybook/react/types-6-0";
import Button from "../Button";

import { Header, HeaderProps } from "./Header";

export default {
  title: "Header",
  component: Header,
} as Meta;

const Template: Story<HeaderProps> = args => <Header {...args} />;

export const Default = Template.bind({});

export const WithRightText = Template.bind({});
WithRightText.args = {
  right: <span className="text-white text-xl">Login</span>,
};

export const WithRightButton = Template.bind({});
WithRightButton.args = {
  right: <Button label="Login" />,
};
