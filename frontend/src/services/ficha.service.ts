import api from "./api";

// =========================
// TIPOS GUARDAVIA
// =========================

export interface GuardaviaData {
  id_ficha?: string;
  fecha: string;
  provincia: string;
  canton: string;
  parroquia: string;
  tramo_via: string;
  observaciones?: string;
}

// =========================
// TIPOS SEÑALIZACION
// =========================

export interface SenalizacionData {
  id_ficha?: string;
  fecha: string;
  provincia: string;
  canton: string;
  tipo: string;
  material: string;
  estado: string;
}

// =========================
// TIPOS ALCANTARILLA
// =========================

export interface AlcantarillaData {
  id_ficha?: string;
  fecha: string;
  provincia: string;
  canton: string;
  diametro: number;
  longitud_tuberia: number;
  estado_general: string;
}

// =========================
// SERVICIO PRINCIPAL
// =========================

class FichaService {

  // ======================================================
  // GUARDAVIA
  // ======================================================

  async getGuardavias() {
    const response = await api.get("/guardavia");
    return response.data;
  }

  async getGuardaviaById(id: string) {
    const response = await api.get(`/guardavia/${id}`);
    return response.data;
  }

  async createGuardavia(data: GuardaviaData) {
    const response = await api.post("/guardavia", data);
    return response.data;
  }

  async updateGuardavia(
    id: string,
    data: GuardaviaData
  ) {
    const response = await api.put(
      `/guardavia/${id}`,
      data
    );

    return response.data;
  }

  async deleteGuardavia(id: string) {
    const response = await api.delete(
      `/guardavia/${id}`
    );

    return response.data;
  }

  // ======================================================
  // SEÑALIZACION
  // ======================================================

  async getSenalizaciones() {
    const response = await api.get("/senalizacion");
    return response.data;
  }

  async getSenalizacionById(id: string) {
    const response = await api.get(
      `/senalizacion/${id}`
    );

    return response.data;
  }

  async createSenalizacion(
    data: SenalizacionData
  ) {
    const response = await api.post(
      "/senalizacion",
      data
    );

    return response.data;
  }

  async updateSenalizacion(
    id: string,
    data: SenalizacionData
  ) {
    const response = await api.put(
      `/senalizacion/${id}`,
      data
    );

    return response.data;
  }

  async deleteSenalizacion(id: string) {
    const response = await api.delete(
      `/senalizacion/${id}`
    );

    return response.data;
  }

  // ======================================================
  // ALCANTARILLA
  // ======================================================

  async getAlcantarillas() {
    const response = await api.get("/alcantarilla");
    return response.data;
  }

  async getAlcantarillaById(id: string) {
    const response = await api.get(
      `/alcantarilla/${id}`
    );

    return response.data;
  }

  async createAlcantarilla(
    data: AlcantarillaData
  ) {
    const response = await api.post(
      "/alcantarilla",
      data
    );

    return response.data;
  }

  async updateAlcantarilla(
    id: string,
    data: AlcantarillaData
  ) {
    const response = await api.put(
      `/alcantarilla/${id}`,
      data
    );

    return response.data;
  }

  async deleteAlcantarilla(id: string) {
    const response = await api.delete(
      `/alcantarilla/${id}`
    );

    return response.data;
  }
}

// =========================
// EXPORTAR SERVICIO
// =========================

const fichaService = new FichaService();

export default fichaService;