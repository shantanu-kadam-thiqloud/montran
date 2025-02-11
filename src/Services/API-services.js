import RestDataSource from "./Api-request";
import { Global_var } from "../Global_VAR";

let BaseUrl = Global_var.BASEURL;

export function getData(QueryStringData, APIURL, res) {
  const URL = `${APIURL}?id=${QueryStringData}`;
  return new RestDataSource().GetData(URL, res);
}

export function saveData(MappingData, APIURL, res) {
  return new RestDataSource().PostData(APIURL, res, MappingData);
}

export function fetchList(APIURL, res) {
  return new RestDataSource().GetData(APIURL, res);
}
