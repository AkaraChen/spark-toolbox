export interface Status {
    data: StatusData
    message: string
    success: boolean
}

export interface StatusData {
    InviteRegisterEnabled: boolean
    InvoiceMinAmount: number
    QuotaForInvitee: number
    QuotaForInviter: number
    RechargeDiscount: StatusRechargeDiscount
    RechargeType: string
    TopUpBanner: string
    aff_limit: number
    aff_rate: number
    chats: Array<StatusChat>
    chats_verify_enabled: boolean
    checkin_max_quota: number
    checkin_min_quota: number
    company_verify_enabled: boolean
    currency_symbol: string
    data_export_default_time: string
    default_collapse_sidebar: boolean
    demo_site_enabled: boolean
    display_in_currency: boolean
    email_verification: boolean
    enable_aff: boolean
    enable_aff_verify: boolean
    enable_batch_update: boolean
    enable_checkin: boolean
    enable_data_export: boolean
    enable_drawing: boolean
    enable_task: boolean
    footer_html: string
    github_client_id: string
    github_oauth: boolean
    google_client_id: string
    google_oauth: boolean
    header_nav: Array<StatusHeaderNav>
    is_agent: string
    linuxdo_client_id: string
    linuxdo_oauth: boolean
    logo: string
    mj_notify_enabled: boolean
    new_user_level: string
    oidc_authorization_endpoint: string
    oidc_client_id: string
    oidc_enabled: boolean
    personal_verify_enabled: boolean
    pricing_type: string
    qrcode: string
    quota_per_unit: number
    quotafornewuser: number
    rix_admin_message: string
    rix_expiration_time: string
    rix_shutdown_message: string
    rix_version_message: string
    rixapi_promax: boolean
    searchlogsbykeylink: string
    seo_description: string
    seo_keywords: string
    server_address: string
    setup: boolean
    show_notice: boolean
    show_price_page_ratio: boolean
    slide_captcha: boolean
    start_time: number
    system_name: string
    theme_color: string
    top_up_link: string
    turnstile_check: boolean
    turnstile_site_key: string
    uptime_kuma_status: boolean
    uptime_kuma_uptime_url: string
    uptime_official_setting: string
    version: string
    wechat_login: boolean
    wechat_qrcode: string
}

export interface StatusRechargeDiscount {}

export interface StatusChat {
    logo: string
    name: string
    url: string
}

export interface StatusHeaderNav {
    content: string
    displayType: string
    enabled: boolean
    isDefault: boolean
    name: string
    path: string
}

export interface User {
    data: UserData
    message: string
    success: boolean
}

export interface UserData {
    id: number
    username: string
    password: string
    original_password: string
    display_name: string
    role: number
    status: number
    email: string
    github_id: string
    oidc_id: string
    wechat_id: string
    telegram_id: string
    verification_code: string
    access_token: any
    quota: number
    used_quota: number
    request_count: number
    group: string
    aff_code: string
    aff_count: number
    aff_quota: number
    aff_history_quota: number
    inviter_id: number
    DeletedAt: any
    linux_do_id: string
    setting: string
}
