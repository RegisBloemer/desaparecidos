import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";

import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import Layout from "@/components/layout";
import Select from "@/components/select";
import Select_eyes from "@/components/select_eyes";
import Select_hair from "@/components/select_hair";

export default function ProfileEdit(props) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const get_uf = async (select_counry) => {
    if (!select_counry) {
      return false;
    }
    console.log("uf", select_counry);
    set_loading_uf(true);
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
    } finally {
      set_loading_uf(false);
    }
  };

  const [uf_options, set_uf_options] = useState(get_uf);

  const [select_counry, set_select_counry] = useState({
    value: 76,
    label: "Brazil",
    ISO: "BR",
  });
  const [select_nation, set_select_nation] = useState({
    value: 76,
    label: "Brazil",
    ISO: "BR",
  });
  const [select_eye, set_select_eye] = useState(false);
  const [select_hair, set_select_hair] = useState(false);
  const [select_uf, set_select_uf] = useState(false);
  const [select_city, set_select_city] = useState(false);
  const [loading_submit, set_loading_submit] = useState(false);
  const [loading_uf, set_loading_uf] = useState(false);
  const [loading_city, set_loading_city] = useState(false);

  useEffect(() => {
    get_uf(select_counry).then((e) => {
      set_uf_options(e);
    });
  }, [select_counry]);

  const get_city = async (select_uf) => {
    if (!select_uf) {
      return false;
    }

    console.log("city", select_uf);
    set_loading_city(true);
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
    } finally {
      set_loading_city(false);
    }
  };

  useEffect(() => {
    get_city(select_uf).then((e) => {
      set_city_options(e);
    });
  }, [select_uf]);

  const [city_options, set_city_options] = useState(get_city);

  const onSubmit = async (data) => {
    console.log("onSubmit", data);
    set_loading_submit(true);

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

    set_loading_submit(false);
  };

  return (
    <Layout>
      <Head>
        <title>Cadastro de pessoa</title>
      </Head>
      <main className="mt-5 py-5">
        <section className="container mb-5 text-center">
          <h1>Cadastro de pessoa desaparecidas</h1>
          <br />
          <h4>Informações Básicas</h4>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="g-3 needs-validation mt-5 pt-5"
          >
            <div className="col-sm-6 mx-auto my-3">
              <label htmlFor="name" className="form-label">
                Nome completo <span className="text-danger">*</span>
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
                  Por favor insira um nome válido!
                </div>
              )}
            </div>
            <div className="col-sm-6 mx-auto my-3">
              <label htmlFor="surname" className="form-label">
                Apelido
              </label>
              <input
                type="text"
                id="surname"
                className="form-control rounded-5 shadow"
              />
            </div>
            <div className="col-sm-6 mx-auto my-3">
              <label htmlFor="clothing" className="form-label">
                Vestimenta no momento do desaparecimento
              </label>
              <input
                type="text"
                id="clothing"
                className="form-control rounded-5 shadow"
              />
            </div>
            <div className="row justify-content-center">
              <div className="col-sm-5 mt-3">
                <label htmlFor="eyes" className="form-label">
                  Cor dos olhos
                </label>
                <Select_eyes instanceId="eye-select" placeholder="" />
                <label for="eye-trust" className="form-label">
                  Nível de Confiança da Informação:
                </label>
                <input
                  type="range"
                  class="form-range"
                  min="0"
                  max="30"
                  defaultValue="0"
                  step="10"
                  id="eye-trust"
                />
              </div>
              <div className="col-sm-5 mt-3">
                <label htmlFor="hair" className="form-label">
                  Cor do cabelo
                </label>
                <Controller
                  name="hair"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select_hair
                      {...field}
                      onChange={(e) => {
                        set_select_hair(e);
                        field.onChange(e);
                      }}
                      value={select_hair}
                      instanceId="hair-select"
                      placeholder=""
                    />
                  )}
                />
              </div>
              <div className="col-sm-5 mt-3">
                <label htmlFor="name" className="form-label">
                  Data do último contato<span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  id="visited_at"
                  className={`form-control px-2 pt-1 m-2 border ${
                    errors.visited_at ? "is-invalid" : ""
                  } rounded-5 shadow`}
                  {...register("visited_at", {
                    valueAsDate: true,
                    required: "required",
                  })}
                />
                {errors.visited_at && (
                  <div className="invalid-feedback">
                    Por favor insira uma data de nascimento valida!
                  </div>
                )}
              </div>
              <div className="col-sm-5 mt-3">
                <label htmlFor="name" className="form-label">
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
                    Por favor insira uma data de nascimento valida!
                  </div>
                )}
              </div>
              <div className="col-sm-5 mt-3 px-5">
                <div className="form-check px-5">
                  <label className="form-check-label" htmlFor="gender">
                    Peso aproximado
                  </label>
                  <Form.Check
                    id="gender"
                    type="checkbox"
                    value=""
                    className="form-check-input shadow"
                  />
                </div>
              </div>
              <div className="col-sm-5 mt-3">
                <label htmlFor="weight" className="form-label">
                  Peso aproximado
                </label>
                <input
                  type="number"
                  id="weight"
                  className="form-control px-2 pt-1 m-2 border  rounded-5 shadow"
                />
              </div>
              <div className="col-sm-5 mt-3">
                <label htmlFor="tattoo" className="form-label">
                  Quantidade de tatuagem aproximado
                </label>
                <input
                  type="number"
                  id="tattoo"
                  defaultValue="0"
                  min="0"
                  className="form-control px-2 pt-1 m-2 border  rounded-5 shadow"
                />
              </div>
              <div className="col-sm-5 mt-3">
                <label htmlFor="nation" className="form-label">
                  Nacionalidade
                </label>
                <Controller
                  name="nation"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={props.countries}
                      onChange={(e) => {
                        set_select_nation(e);
                        field.onChange(e);
                      }}
                      value={select_nation}
                      instanceId="nation-select"
                      placeholder=""
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderRadius: "var(--bs-border-radius-xxl)!important",
                          margin: ".5rem!important",
                          border:
                            "var(--bs-border-width) var(--bs-border-style) var(--bs-border-color)!important",
                          boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)!important",
                          width: "100%",
                        }),
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="row col-sm-9 mx-auto mt-5">
              <h5 className="mb-4">
                Local onde a pessoa foi vista pela última vez
              </h5>
              <div className="col-sm-4 mb-3">
                <label>
                  Selecione pais <span className="text-danger">*</span>
                </label>
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
                        console.log("counry", e);
                        set_select_counry(e);
                        set_select_uf(false);
                        set_select_city(false);

                        field.onChange(e); // make sure to keep this to update form state
                      }}
                      value={select_counry}
                      instanceId="countries-select"
                      placeholder="Paises"
                      className={errors.counry ? "is-invalid" : ""}
                    />
                  )}
                />
                {errors.counry && (
                  <div className="invalid-feedback">
                    Por favor escolha pais!
                  </div>
                )}
              </div>
              <div className="col-sm-4 mb-3">
                <label className="w-100">
                  Selecione estado <span className="text-danger">*</span>
                </label>
                {loading_uf ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
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
                      />
                    )}
                  />
                )}
                {errors.uf && (
                  <div className="invalid-feedback">
                    Por favor escolha estado!
                  </div>
                )}
              </div>
              <div className="col-sm-4 mb-3">
                <label className="w-100">
                  Selecione cidade <span className="text-danger">*</span>
                </label>
                {loading_city ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
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
                            borderRadius:
                              "var(--bs-border-radius-xxl)!important",
                            margin: ".5rem!important",
                            border:
                              "var(--bs-border-width) var(--bs-border-style) var(--bs-border-color)!important",
                            boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)!important",
                          }),
                        }}
                      />
                    )}
                  />
                )}
                {errors.city && (
                  <div className="invalid-feedback">
                    Por favor escolha cidade!
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 d-flex justify-content-center mt-5">
              <Controller
                name="hCaptcha"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <HCaptcha
                    sitekey="677d3abd-134a-4053-ab76-f947a3082aaa"
                    onVerify={(token) => {
                      field.onChange(token);
                      clearErrors("hCaptcha");
                    }}
                    onError={() => {
                      toast.error("Captcha error");
                      return setError("hCaptcha", {
                        type: "manual",
                        message: "Captcha error",
                      });
                    }}
                    onExpire={() => {
                      toast.error("Captcha expired");
                      return setError("hCaptcha", {
                        type: "manual",
                        message: "Captcha expired",
                      });
                    }}
                  />
                )}
              />
            </div>
            <div className="col-12 d-flex text-center  my-5">
              {loading_submit ? (
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
                  Registrar
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
