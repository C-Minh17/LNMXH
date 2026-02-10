declare module MStatistic {
  //extract
  interface IExtract {
    source: "articles" | "important_posts" | "both",
    year: number | null | undefined,
    quarter: number | null | undefined,
    skip: number,
    force_update: boolean,
  }
  interface IExtractionTask {
    task_id: string;
    task_type: string;
    task_name: string;
    status: 'PENDING' | 'ROCESSING' | 'COMPLETED' | 'FAILED' | string;
    progress_percent: number;
    progress_message: string;
    result: string;
    error_message: string;
    created_at: string;
    started_at: string;
    completed_at: string;
  }

  //query param
  interface QueryParams1 {
    year: number | null | undefined;
    quarter: number | null | undefined;
    period_type: string | null | undefined;
    skip: number;
    limit: number;
  }

  interface QueryParams2 {
    year: number | null | undefined;
    quarter: number | null | undefined;
    province: string | null | undefined;
    skip: number;
    limit: number;
  }

  interface QueryParams3 {
    year: number | null | undefined;
    month: number | null | undefined;
    province: string | null | undefined;
    skip: number;
    limit: number;
  }

  interface QueryParams4 {
    year: number | null | undefined;
    province: string | null | undefined;
    skip: number;
    limit: number;
  }

  //grdp
  interface IGrdp {
    id: number,
    province: string,
    period_type: string,
    year: number,
    quarter: number,
    actual_value: number,
    forecast_value: number,
    change_yoy: number,
    change_qoq: number,
    change_prev_period: number,
    data_status: string,
    data_source: string,
    last_updated: string,
    period_label: string,
    document_type: "internal" | "external",
  }

  //fdi
  interface IFdi {
    id: number,
    province: string,
    period_type: string,
    period_label: string,
    year: number,
    quarter: number,
    month: number,
    actual_value: number,
    forecast_value: number,
    change_yoy: number,
    change_qoq: number,
    registered_capital: number,
    new_projects_capital: number,
    disbursed_capital: number,
    disbursement_rate: number,
    total_projects: number,
    new_projects: number,
    data_status: string,
    data_source: string,
    last_updated: string,
    document_type: "internal" | "external",
  }

  //iip
  interface IIip {
    id: number,
    province: string,
    period_type: string,
    year: number,
    quarter: number,
    month: number,
    actual_value: number,
    forecast_value: number,
    change_yoy: number,
    change_qoq: number,
    change_mom: number,
    change_prev_period: number,
    data_status: string,
    data_source: string,
    document_type: "internal" | "external",
    last_updated: string,
  }

  //Digital Transformation
  interface IDigitalTransformation {
    id: number;
    province: string;
    period_type: string;
    year: number;
    quarter: number | null;
    month: number | null;
    actual_value: number | null;
    forecast_value: number | null;
    change_yoy: number | null;
    change_qoq: number | null;
    change_mom: number | null;
    change_prev_period: number | null;
    dx_index: number | null;
    dx_readiness_index: number | null;
    egov_index: number | null;
    online_public_services: number | null;
    level3_services: number | null;
    level4_services: number | null;
    online_service_usage_rate: number | null;
    cloud_adoption_rate: number | null;
    broadband_coverage: number | null;
    fiveg_coverage: number | null;
    sme_dx_adoption: number | null;
    companies_using_ai: number | null;
    companies_using_iot: number | null;
    digital_literacy_rate: number | null;
    ai_projects: number | null;
    iot_projects: number | null;
    dx_investment: number | null;
    productivity_increase_from_dx: number | null;
    data_status: 'estimated' | 'official';
    data_source: string;
    document_type: 'internal' | 'external';
    last_updated: string;
  }

  //pii
  interface IPii {
    id: number,
    province: string,
    period_type: string,
    year: number,
    quarter: number,
    month: number,
    actual_value: number,
    forecast_value: number,
    change_yoy: number,
    change_qoq: number,
    change_mom: number,
    change_prev_period: number,
    pii_overall: number,
    pii_growth_rate: number,
    industrial_output_value: number,
    mining_index: number,
    manufacturing_index: number,
    electricity_index: number,
    food_processing_index: number,
    textile_index: number,
    electronics_index: number,
    state_owned_pii: number,
    private_pii: number,
    fdi_pii: number,
    manufacturing_share: number,
    hightech_industry_share: number,
    labor_productivity: number,
    capacity_utilization: number,
    industrial_enterprises: number,
    industrial_workers: number,
    data_status: string,
    data_source: string,
    document_type: string,
    last_updated: string
  }

  //cpi
  interface ICpi {
    id: number,
    province: string,
    period_type: string,
    year: number,
    quarter: number,
    month: number,
    actual_value: number,
    forecast_value: number,
    change_yoy: number,
    change_qoq: number,
    change_mom: number,
    change_prev_period: number,
    cpi_food: number,
    cpi_housing: number,
    cpi_transport: number,
    cpi_education: number,
    cpi_healthcare: number,
    core_cpi: number,
    inflation_rate: number,
    basket_weights: string,
    data_status: string,
    data_source: string,
    document_type: string,
    last_updated: string,
  }

  //highschool_graduation_detail
  interface IHighschoolGraduationDetail {
    graduation_rate: number,
    total_candidates: number,
    passed_candidates: number,
    average_score: number,
    math_avg_score: number,
    literature_avg_score: number,
    english_avg_score: number,
    excellent_rate: number,
    fail_rate: number,
    id: number,
    province: string,
    year: number,
    quarter: number,
    month: number,
    rank_national: number,
    rank_regional: number,
    yoy_change: number,
    data_status: string,
    data_source: string,
    notes: string,
    document_type: string,
    last_updated: string,
    created_at: string,
    updated_at: string
  }

  // TvetEmployment
  interface ITvetEmployment {
    id: number,
    province: string,
    year: number,
    quarter: number,
    month: number,
    total_graduates: number,
    employed_graduates: number,
    employment_rate: number,
    relevant_job_rate: number,
    average_starting_salary: number,
    employer_satisfaction: number,
    tvet_enrollment: number,
    tvet_facilities: number,
    industry_partnership_count: number,
    data_status: string,
    data_source: string,
    document_type: string
  }

  // CadreStatistics
  interface ICadreStatistics {
    id: number,
    province: string,
    year: number,
    quarter: number,
    month: number,
    total_authorized: number,
    provincial_level: number,
    commune_level: number,
    contract_workers: number,
    data_status: string,
    data_source: string,
    document_type: string
  }

  // HealthStatistics
  interface IHealthStatistics {
    id: number,
    province: string,
    year: number,
    quarter: number,
    month: number,
    bhyt_coverage_rate: number,
    total_insured: number,
    voluntary_insured: number,
    natural_population_growth_rate: number,
    elderly_health_checkup_rate: number,
    sex_ratio_at_birth: number,
    data_status: string,
    data_source: string,
    document_type: string
  }

  // CultureLifestyle
  interface ICultureLifestyle {
    id: number,
    province: string,
    year: number,
    quarter: number,
    month: number,
    total_heritage_sites: number,
    tourist_visitors: number,
    tourism_revenue_billion: number,
    natural_population_growth_rate: number,
    elderly_health_checkup_rate: number,
    sex_ratio_at_birth: number,
    data_status: string,
    data_source: string,
    document_type: string
  }

  // Security
  interface ISecurity {
    id: number,
    province: string,
    year: number,
    quarter: number,
    month: number,
    drug_cases: number,
    drug_offenders: number,
    crime_reduction_rate: number,
    data_status: string,
    data_source: string,
    document_type: string,
    last_updated: string,
  }

  // ParIndex
  interface IParIndex {
    id: number,
    province: string,
    year: number,
    quarter: number,
    month: number,
    par_index_score: number,
    institutional_reform_score: number,
    admin_procedure_score: number,
    organizational_reform_score: number,
    civil_service_reform_score: number,
    public_finance_reform_score: number,
    egovernment_reform_score: number,
    citizen_impact_score: number,
    onestop_processing_rate: number,
    simplified_procedures_count: number,
    rank_national: number,
    rank_regional: number,
    yoy_change: number,
    data_status: string,
    data_source: string,
    document_type: string,
    notes: string,
    last_updated: string,
    created_at: string,
    updated_at: string
  }
  // Sipas
  interface ISipas {
    id: number,
    province: string,
    year: number,
    quarter: number,
    month: number,
    sipas_score: number,
    service_access_score: number,
    procedure_simplicity_score: number,
    staff_attitude_score: number,
    processing_time_score: number,
    transparency_score: number,
    online_service_score: number,
    complaint_resolution_score: number,
    surveys_conducted: number,
    respondents_count: number,
    satisfaction_rate: number,
    rank_national: number,
    rank_regional: number,
    yoy_change: number,
    data_status: string,
    data_source: string,
    document_type: string,
    notes: string,
    last_updated: string,
    created_at: string,
    updated_at: string
  }
}