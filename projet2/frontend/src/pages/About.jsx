import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
          Bienvenue chez HealthCare, votre partenaire de confiance pour gérer vos besoins de santé de manière simple et efficace. Chez PredictaCare, nous comprenons les difficultés rencontrées par les patients pour prendre rendez-vous chez le médecin et gérer leur dossier médical.
          </p>
          <p>
          HealthCare s'engage à atteindre l'excellence en matière de technologies médicales. Nous nous efforçons continuellement d'améliorer notre plateforme en intégrant les dernières avancées pour améliorer l'expérience utilisateur et offrir un service de qualité supérieure. Que vous preniez votre premier rendez-vous ou que vous gériez vos soins, HealthCare est là pour vous accompagner à chaque étape.
          </p>
          <b className="text-gray-800">Notre vision</b>
          <p>
          Chez HealthCare, notre vision est de créer une expérience de soins fluide pour chaque utilisateur. Nous cherchons à rapprocher les patients des professionnels de santé, en vous facilitant l'accès aux soins dont vous avez besoin, quand vous en avez besoin.
          </p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p>
        POURQUOI <span className="text-gray-700 font-semibold">CHOISISSEZ-NOUS</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border border-gray-200 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>EFFICACITÉ:</b>
          <p>
          Planification de rendez-vous simplifiée qui s’adapte à votre style de vie chargé.
          </p>
        </div>
        <div className="border border-gray-200 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>
          COMMODITÉ:</b>
          <p>
          Accédez à un réseau de professionnels de la santé de confiance dans votre région.
          </p>
        </div>
        <div className="border border-gray-200 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>PERSONALISATION:</b>
          <p>
          Des recommandations et des rappels personnalisés pour vous aider à rester au top de votre santé.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;