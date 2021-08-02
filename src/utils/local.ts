import UkLocal from "../components/UkLocal.vue";

export function getLocalComponent(country:string) {
  if(country === "UK"){
    return UkLocal;
  }
  return null;
}