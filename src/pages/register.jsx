import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";

import { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

import Layout from "@/components/layout";
import Select from "@/components/select";

export default function ProfileEdit(props) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const [select_counry, set_select_counry] = useState(false);
  const [select_uf, set_select_uf] = useState(false);
  const [select_city, set_select_city] = useState(false);
  const [loading, set_loading] = useState(false);

  const get_uf = async () => {
    if (!select_counry) {
      return false;
    }
    console.log("uf", select_counry);

    try {
      const res = await axios(
        `https://www.geonames.org/servlet/geonames?&srv=163&country=${select_counry.ISO}&featureCode=ADM1&lang=en&type=json`
      );
      const data = res.data.geonames.map((e) => {
        return { value: Number(e.adminCode1), label: e.name };
      });

      return data;
    } catch (err) {
      console.log("err", err);
      throw new Error("Network response was not ok");
    }
  };

  const [uf_options, set_uf_options] = useState(get_uf);

  useEffect(() => {
    get_uf().then((e) => {
      set_uf_options(e);
    });
  }, [select_counry]);

  const get_city = async () => {
    if (!select_uf) {
      return false;
    }

    console.log("city", select_uf);

    try {
      const res = await axios(
        `https://www.geonames.org/servlet/geonames?&srv=163&country=${
          select_counry.ISO
        }&adminCode1=${String(select_uf.value).padStart(
          2,
          "0"
        )}&featureCode=ADM2&lang=en&type=json`
      );

      const city = res.data.geonames.map((e) => {
        return { value: Number(e.adminCode2), label: e.name };
      });

      return city;
    } catch (err) {
      console.log("err", err);
      throw new Error("Network response was not ok");
    }
  };

  useEffect(() => {
    get_city().then((e) => {
      set_city_options(e);
    });
  }, [select_uf]);

  const [city_options, set_city_options] = useState(get_city);

  const onSubmit = async (data) => {
    console.log("onSubmit", data);
    set_loading(true);

    let body = {
      username: data.name,
      email: data.email,
      password: data.password,
      birthday: data.birthday,
      state: data.uf.value,
      city: data.city.value,
      nation: data.counry.ISO,
      latitude: 0,
      longitude: 0,
    };
    if (localisacao.data) {
      const tmp = localisacao.data;
      body.latitude = tmp.latitude;
      body.longitude = tmp.longitude;
    }
    try {
      const res = await axios.post("/api/auth/register", body);
      console.log(res);
      router.push("/");
    } catch (error) {
      if (error.response.data.code == "P2002") {
        toast.error(
          `Erro ja existe um usario com esse ${error.response.data.target[0]}`
        );
      } else {
        console.log("axios error", error);
      }
    }

    set_loading(false);
  };

  return (
    <Layout>
      <Head>
        <title>Regristro de pessoa</title>
      </Head>
      <main className="mt-5 py-5">
        <section className="container mb-5">
          <h1>Informações Básicas</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="g-3 needs-validation"
          >
            <div className="col-sm-6 mx-auto mt-4">
              <label className="form-label" htmlFor="name">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                className={`form-control ${
                  errors.name ? "is-invalid" : ""
                } rounded-5 shadow`}
                {...register("name", {
                  required: true,
                  minLength: 6,
                })}
              />
              {errors.name && (
                <div className="invalid-feedback">
                  Por favor ensira um nome válido!
                </div>
              )}
            </div>
            <div className="col-sm-6 mx-auto mt-4">
              <label className="form-label" htmlFor="surname">
                Apelido
              </label>
              <input
                type="text"
                id="surname"
                className={`form-control rounded-5 shadow`}
                {...register("name")}
              />
            </div>
            <div className="col-sm-6 mx-auto mt-4">
              <label className="form-label" htmlFor="birthday">
                Data de nascimento
              </label>
              <input
                type="date"
                id="birthday"
                className={`form-control px-2 pt-1 m-2 border ${
                  errors.birthday ? "is-invalid" : ""
                } rounded-5 shadow`}
                {...register("birthday", {
                  valueAsDate: true,
                  required: "required",
                })}
              />
              {errors.birthday && (
                <div className="invalid-feedback">
                  Por favor ensira uma data de nascimento valida!
                </div>
              )}
            </div>
            <div className="row mx-auto mt-4">
              <div className="col-sm-6">
                <label>Selecione seu pais</label>
                <Controller
                  name="counry"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={props.countries}
                      onChange={(e) => {
                        set_select_counry(e);
                        set_select_uf(false);
                        set_select_city(false);

                        field.onChange(e); // make sure to keep this to update form state
                      }}
                      value={select_counry}
                      instanceId="countries-select"
                      placeholder="Paises"
                      className={errors.counry ? "is-invalid" : ""}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderRadius: "var(--bs-border-radius-xxl)!important",
                          margin: ".5rem!important",
                          border:
                            "var(--bs-border-width) var(--bs-border-style) var(--bs-border-color)!important",
                          boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)!important",
                        }),
                      }}
                    />
                  )}
                />
                {errors.counry && (
                  <div className="invalid-feedback">
                    Por favor escolha pais!
                  </div>
                )}
              </div>
              <div className="col-sm-6">
                <label className="w-100">Selecione seu estado</label>
                <Controller
                  name="uf"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={uf_options}
                      onChange={(e) => {
                        set_select_uf(e);
                        set_select_city(false);
                        field.onChange(e);
                      }}
                      value={select_uf}
                      instanceId="uf-select"
                      placeholder="Estados"
                      className={errors.uf ? "is-invalid" : ""}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderRadius: "var(--bs-border-radius-xxl)!important",
                          margin: ".5rem!important",
                          border:
                            "var(--bs-border-width) var(--bs-border-style) var(--bs-border-color)!important",
                          boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)!important",
                        }),
                      }}
                    />
                  )}
                />
                {errors.uf && (
                  <div className="invalid-feedback">
                    Por favor escolha estado!
                  </div>
                )}
              </div>
              <div className="col-sm-6">
                <label className="w-100">Selecione sua cidade</label>
                <Controller
                  name="city"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={city_options}
                      onChange={(e) => {
                        set_select_city(e);
                        field.onChange(e);
                      }}
                      value={select_city}
                      instanceId="city-select"
                      placeholder="Cidades"
                      className={errors.city ? "is-invalid" : ""}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderRadius: "var(--bs-border-radius-xxl)!important",
                          margin: ".5rem!important",
                          border:
                            "var(--bs-border-width) var(--bs-border-style) var(--bs-border-color)!important",
                          boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)!important",
                        }),
                      }}
                    />
                  )}
                />
                {errors.city && (
                  <div className="invalid-feedback">
                    Por favor escolha cidade!
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 d-flex text-center  my-5">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-primary mx-auto rounded-5 shadow"
                  type="submit"
                >
                  Criar conta
                </button>
              )}
            </div>
          </form>
        </section>
      </main>
    </Layout>
  );
}

export async function getStaticProps(context) {
  const countries_json = require("../../public/countries.json");
  let countries = countries_json.map((e) => {
    return { value: Number(e["ISO-Numeric"]), label: e.Country, ISO: e.ISO };
  });

  countries.sort((a, b) => a.value - b.value);

  return {
    props: {
      countries,
    },
  };
}