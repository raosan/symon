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

import { probe } from "@prisma/client";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Header, Sidebar } from "../";
import { fetcher } from "../../data/requests";
import { ParamTypes } from "../../pages/report";
import { Endpoint } from "../Sidebar/Sidebar";

type LayoutProps = {
  children?: React.ReactNode;
  isLoading?: boolean;
  endpoints?: Endpoint[];
};

export default function Layout({
  children,
  isLoading,
}: LayoutProps): JSX.Element {
  const { orgName, projectID } = useParams<ParamTypes>();

  const { data } = useQuery("getProbes", () =>
    fetcher(`/probes`, {
      method: "GET",
    }),
  );

  if (isLoading) {
    return <Content>Loading...</Content>;
  }
  return (
    <Content
      endpoints={data?.map((item: probe) => {
        return {
          to: `/${orgName}/${projectID}/${item.name}/report`,
          title: item.name,
        };
      })}
    >
      {children}
    </Content>
  );
}

function Content({ children, endpoints }: LayoutProps): JSX.Element {
  return (
    <main className="flex items-start justify-between overflow-hidden">
      <Sidebar endpoints={endpoints} />
      <div className="w-full sm:w-9/12 xl:w-10/12">
        <Header />
        <div className="container mx-auto px-4 py-5 sm:px-6 lg:px-7">
          {children}
        </div>
      </div>
    </main>
  );
}
