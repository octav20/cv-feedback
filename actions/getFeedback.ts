import { generateText } from "ai";
import classifyCV from "./classifyCv";
import { gemini } from "@/lib/models";

let feedbackString = "";

async function getFeeback(
  cvObj: {
    cv_aboutme_summary: any;
    cv_skills: any;
    cv_education: any;
    cv_experiencia: any;
    cv_proyects: any;
  },
  jobObj: {
    job_description: any;
    job_skills: any;
    job_responsabilities: any;
    job_experiencia: any;
    job_education: any;
  }
) {
  // matches
  // Experiencia: job: Experience | cv: projects, experience, aboutme_summary
  // Education: job: education | cv: education, aboutme_summary
  // Skills: job: skills | cv: skills, aboutme_summary, projects
  // Responsabilidades: job: responsibilities, description | cv: projects, experience, aboutme_summary

  const {
    cv_aboutme_summary,
    cv_skills,
    cv_education,
    cv_experiencia,
    cv_proyects,
  } = cvObj;
  const {
    job_description,
    job_skills,
    job_responsabilities,
    job_experiencia,
    job_education,
  } = jobObj;

  await createRecomendation(
    [job_experiencia, job_description],
    [cv_proyects, cv_experiencia, cv_aboutme_summary],
    "Experiencia"
  );
  await createRecomendation(
    [job_skills],
    [cv_proyects, cv_experiencia, cv_skills],
    "Habilidades - Skills"
  );
  await createRecomendation(
    [job_skills, job_responsabilities],
    [cv_proyects, cv_experiencia, cv_aboutme_summary],
    "Actividades - Responsabilidades"
  );
  await createRecomendation(
    [job_education],
    [cv_education, cv_aboutme_summary],
    "Educacion"
  );

  return feedbackString;
}

export default getFeeback;

async function createRecomendation(
  job_items: any[],
  cv_items: any[],
  title: string
) {
  const job_item = job_items.join("\n");
  const cv_item = cv_items.join("\n");
  const prompt = `
      Quiero que des recomendaciones que se puede modificar o tratar de incluir en el CV, si
      Estoy postulando al siguiente trabajo con los siguientes requisitos. Las recomendaciones no deben ser mayor a 50 palabras, debes limitarte a analizar a la siguiente informacion dada. Para el formato de salida califica el perfil al costado del title de 0 a 100, donde 0 es el peor perfil y 100 es el mejor.
      Si se esta analizando educacion solo menciona si cumple o no con los requisitos minimos de ello y anima a que todavia intente postular y que puede demostrar sus conocimientos en una prueba tecnica (omite el formato de salida sugerido a contiacuion para educacion)

      Adicionalmente si ya tiene estas recomendaciones no las incluyas por que es redudante y tampoco imprimas estas recomendaciones: RECOMENDACIONES ANTERIORES: ${feedbackString}
  
      # Oferta de Trabajo
        - ${title}: ${job_item}

      # CV - Actual  
        - ${title}: 
            ${cv_item}
  
      El Formato de salida debe ser de la siguiente manera, solo incluye el titulo y las recomendaciones que estan en 3 puntos:
      
      ## ${title}: {Aqui el Score para este titulo} / 100 \n

         - ...\n
         - ...\n
      `;
  const { text } = await generateText({
    model: gemini,
    prompt,
    system:
      "Eres un reclutador profesional y estas ayudando a a un candidato a mejorar su perfil para un puesto de trabajo tomando en consideracion su cv",
  });
  feedbackString += `\n${text}`;
  return text;
}
