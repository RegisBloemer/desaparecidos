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
    return (
        <Layout>
            <Head>
                <title>Regristro de pessoa</title>
            </Head>

            <main className="mt-5 py-5">
                <section className="container mb-5">
                    <h1>Criação de conta</h1>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="g-3 needs-validation"
                    >
                        <div className="col-sm-6 mx-auto mt-4">
                            <label className="form-label" htmlFor="name">
                                Nome
                            </label>
                            <input
                                type="text"
                                id="name"
                                className={`form-control ${errors.username ? "is-invalid" : ""
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