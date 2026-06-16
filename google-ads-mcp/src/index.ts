import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { GoogleAdsApi, enums } from "google-ads-api";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const MCC_ID = (process.env.GOOGLE_ADS_MCC_ID || "7106951176").replace(/-/g, "");
const DEFAULT_CUSTOMER = (process.env.GOOGLE_ADS_DEFAULT_CUSTOMER_ID || "").replace(/-/g, "");

const adsClient = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
});

function getCustomer(customerId?: string) {
  const id = (customerId || DEFAULT_CUSTOMER).replace(/-/g, "");
  if (!id) throw new Error("customer_id é obrigatório (ou defina GOOGLE_ADS_DEFAULT_CUSTOMER_ID no .env)");
  return adsClient.Customer({
    customer_id: id,
    login_customer_id: MCC_ID,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
  });
}

function matchTypeEnum(type: string): enums.KeywordMatchType {
  const t = type.toUpperCase();
  if (t === "EXACT") return enums.KeywordMatchType.EXACT;
  if (t === "BROAD") return enums.KeywordMatchType.BROAD;
  return enums.KeywordMatchType.PHRASE;
}

function fmtNum(n: number, dec = 2) {
  return n.toFixed(dec);
}

function microsToBrl(micros: number) {
  return `R$${(micros / 1_000_000).toFixed(2)}`;
}

// ─── MCP Server ───────────────────────────────────────────────────────────────

const server = new Server(
  { name: "google-ads-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ─── Tool Definitions ─────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list_accounts",
      description: "Lista todas as contas cliente sob a MCC (Manager Account)",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "list_campaigns",
      description: "Lista campanhas de uma conta com métricas de desempenho (impressões, cliques, custo, conversões)",
      inputSchema: {
        type: "object",
        properties: {
          customer_id: { type: "string", description: "ID da conta cliente (ex: 123-456-7890 ou 1234567890)" },
          date_range: { type: "string", description: "Período: LAST_7_DAYS, LAST_14_DAYS, LAST_30_DAYS, THIS_MONTH, LAST_MONTH. Padrão: LAST_30_DAYS" },
        },
        required: [],
      },
    },
    {
      name: "list_ad_groups",
      description: "Lista grupos de anúncio de uma campanha específica",
      inputSchema: {
        type: "object",
        properties: {
          customer_id: { type: "string", description: "ID da conta cliente" },
          campaign_id: { type: "string", description: "ID da campanha" },
          date_range: { type: "string", description: "Período. Padrão: LAST_30_DAYS" },
        },
        required: ["campaign_id"],
      },
    },
    {
      name: "list_keywords",
      description: "Lista palavras-chave com desempenho (cliques, custo, conversões, CPC médio)",
      inputSchema: {
        type: "object",
        properties: {
          customer_id: { type: "string", description: "ID da conta cliente" },
          campaign_id: { type: "string", description: "Filtrar por campanha (opcional)" },
          date_range: { type: "string", description: "Período. Padrão: LAST_30_DAYS" },
          status: { type: "string", description: "ENABLED, PAUSED, ALL. Padrão: ALL" },
        },
        required: [],
      },
    },
    {
      name: "list_negative_keywords",
      description: "Lista palavras-chave negativas no nível de campanha",
      inputSchema: {
        type: "object",
        properties: {
          customer_id: { type: "string", description: "ID da conta cliente" },
          campaign_id: { type: "string", description: "ID da campanha (opcional — lista de todas se omitido)" },
        },
        required: [],
      },
    },
    {
      name: "add_negative_keywords",
      description: "Adiciona palavras-chave negativas a uma campanha. Aceita lista de termos e tipo de correspondência.",
      inputSchema: {
        type: "object",
        properties: {
          customer_id: { type: "string", description: "ID da conta cliente" },
          campaign_id: { type: "string", description: "ID da campanha onde adicionar as negativas" },
          keywords: {
            type: "array",
            items: { type: "string" },
            description: "Lista de palavras-chave a bloquear (ex: [\"aws\", \"accenture\", \"sap\"])",
          },
          match_type: {
            type: "string",
            enum: ["PHRASE", "EXACT", "BROAD"],
            description: "Tipo de correspondência. Padrão: PHRASE (recomendado para negativos)",
          },
        },
        required: ["campaign_id", "keywords"],
      },
    },
    {
      name: "remove_negative_keyword",
      description: "Remove uma palavra-chave negativa de uma campanha pelo ID do critério",
      inputSchema: {
        type: "object",
        properties: {
          customer_id: { type: "string", description: "ID da conta cliente" },
          campaign_id: { type: "string", description: "ID da campanha" },
          criterion_id: { type: "string", description: "ID do critério (obtido via list_negative_keywords)" },
        },
        required: ["campaign_id", "criterion_id"],
      },
    },
    {
      name: "get_search_terms_report",
      description: "Relatório de termos de pesquisa — o que os usuários realmente pesquisaram antes de clicar no anúncio. Use para encontrar negativos.",
      inputSchema: {
        type: "object",
        properties: {
          customer_id: { type: "string", description: "ID da conta cliente" },
          campaign_id: { type: "string", description: "Filtrar por campanha (opcional)" },
          date_range: { type: "string", description: "Período. Padrão: LAST_30_DAYS" },
          min_clicks: { type: "number", description: "Filtrar termos com pelo menos N cliques. Padrão: 1" },
          limit: { type: "number", description: "Máximo de linhas retornadas. Padrão: 100" },
        },
        required: [],
      },
    },
    {
      name: "get_campaign_performance",
      description: "Desempenho detalhado por campanha: impressões, cliques, CTR, CPC médio, custo, conversões, custo/conversão",
      inputSchema: {
        type: "object",
        properties: {
          customer_id: { type: "string", description: "ID da conta cliente" },
          date_range: { type: "string", description: "Período. Padrão: LAST_30_DAYS" },
        },
        required: [],
      },
    },
    {
      name: "get_keyword_performance",
      description: "Desempenho por palavra-chave com Quality Score e métricas de lances",
      inputSchema: {
        type: "object",
        properties: {
          customer_id: { type: "string", description: "ID da conta cliente" },
          campaign_id: { type: "string", description: "Filtrar por campanha (opcional)" },
          date_range: { type: "string", description: "Período. Padrão: LAST_30_DAYS" },
          order_by: { type: "string", description: "cost, clicks, conversions, ctr. Padrão: cost" },
          limit: { type: "number", description: "Máximo de linhas. Padrão: 50" },
        },
        required: [],
      },
    },
    {
      name: "update_campaign_budget",
      description: "Atualiza o orçamento diário de uma campanha",
      inputSchema: {
        type: "object",
        properties: {
          customer_id: { type: "string", description: "ID da conta cliente" },
          campaign_id: { type: "string", description: "ID da campanha" },
          daily_budget_brl: { type: "number", description: "Novo orçamento diário em reais (ex: 150.00)" },
        },
        required: ["campaign_id", "daily_budget_brl"],
      },
    },
    {
      name: "update_campaign_status",
      description: "Pausa ou ativa uma campanha",
      inputSchema: {
        type: "object",
        properties: {
          customer_id: { type: "string", description: "ID da conta cliente" },
          campaign_id: { type: "string", description: "ID da campanha" },
          status: { type: "string", enum: ["ENABLED", "PAUSED"], description: "ENABLED para ativar, PAUSED para pausar" },
        },
        required: ["campaign_id", "status"],
      },
    },
    {
      name: "update_keyword_bid",
      description: "Atualiza o CPC máximo de uma palavra-chave (para estratégia Manual CPC)",
      inputSchema: {
        type: "object",
        properties: {
          customer_id: { type: "string", description: "ID da conta cliente" },
          ad_group_id: { type: "string", description: "ID do grupo de anúncio" },
          criterion_id: { type: "string", description: "ID da palavra-chave (obtido via list_keywords)" },
          max_cpc_brl: { type: "number", description: "Novo CPC máximo em reais (ex: 8.50)" },
        },
        required: ["ad_group_id", "criterion_id", "max_cpc_brl"],
      },
    },
    {
      name: "update_keyword_status",
      description: "Pausa ou ativa uma palavra-chave",
      inputSchema: {
        type: "object",
        properties: {
          customer_id: { type: "string", description: "ID da conta cliente" },
          ad_group_id: { type: "string", description: "ID do grupo de anúncio" },
          criterion_id: { type: "string", description: "ID da palavra-chave" },
          status: { type: "string", enum: ["ENABLED", "PAUSED"] },
        },
        required: ["ad_group_id", "criterion_id", "status"],
      },
    },
    {
      name: "run_gaql",
      description: "Executa uma query GAQL (Google Ads Query Language) personalizada. Use para consultas avançadas não cobertas pelas outras tools.",
      inputSchema: {
        type: "object",
        properties: {
          customer_id: { type: "string", description: "ID da conta cliente" },
          query: { type: "string", description: "Query GAQL. Ex: SELECT campaign.name, metrics.clicks FROM campaign WHERE metrics.clicks > 100" },
        },
        required: ["query"],
      },
    },
  ],
}));

// ─── Tool Handlers ─────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = (args || {}) as Record<string, any>;

  try {
    switch (name) {
      // ── list_accounts ────────────────────────────────────────────────────────
      case "list_accounts": {
        const mcc = adsClient.Customer({
          customer_id: MCC_ID,
          login_customer_id: MCC_ID,
          refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
        });
        const rows = await mcc.query(`
          SELECT
            customer_client.id,
            customer_client.descriptive_name,
            customer_client.currency_code,
            customer_client.time_zone,
            customer_client.manager,
            customer_client.status
          FROM customer_client
          WHERE customer_client.manager = false
            AND customer_client.status = 'ENABLED'
          ORDER BY customer_client.descriptive_name
        `);
        const lines = rows.map((r: any) => {
          const c = r.customer_client;
          return `• ${c.descriptive_name} — ID: ${c.id} | ${c.currency_code} | ${c.time_zone}`;
        });
        return text(`Contas sob MCC ${MCC_ID}:\n\n${lines.join("\n")}`);
      }

      // ── list_campaigns ───────────────────────────────────────────────────────
      case "list_campaigns": {
        const customer = getCustomer(a.customer_id);
        const dr = a.date_range || "LAST_30_DAYS";
        const rows = await customer.query(`
          SELECT
            campaign.id,
            campaign.name,
            campaign.status,
            campaign.bidding_strategy_type,
            campaign_budget.amount_micros,
            metrics.impressions,
            metrics.clicks,
            metrics.ctr,
            metrics.average_cpc,
            metrics.cost_micros,
            metrics.conversions,
            metrics.cost_per_conversion
          FROM campaign
          WHERE campaign.status != 'REMOVED'
            AND segments.date DURING ${dr}
          ORDER BY metrics.cost_micros DESC
        `);
        if (!rows.length) return text("Nenhuma campanha encontrada.");
        const lines = rows.map((r: any) => {
          const c = r.campaign;
          const b = r.campaign_budget;
          const m = r.metrics;
          const status = c.status === 2 ? "✓ ATIVA" : c.status === 3 ? "⏸ PAUSADA" : `${c.status}`;
          const budget = b ? microsToBrl(b.amount_micros) + "/dia" : "—";
          return [
            `ID ${c.id} — ${c.name}`,
            `  Status: ${status} | Orçamento: ${budget} | Estratégia: ${c.bidding_strategy_type}`,
            `  Impressões: ${m.impressions} | Cliques: ${m.clicks} | CTR: ${fmtNum((m.ctr || 0) * 100)}%`,
            `  CPC médio: ${microsToBrl(m.average_cpc || 0)} | Custo: ${microsToBrl(m.cost_micros || 0)}`,
            `  Conversões: ${fmtNum(m.conversions || 0, 1)} | Custo/conv: ${m.conversions ? microsToBrl((m.cost_per_conversion || 0)) : "—"}`,
          ].join("\n");
        });
        return text(`Campanhas (${dr}):\n\n${lines.join("\n\n")}`);
      }

      // ── list_ad_groups ───────────────────────────────────────────────────────
      case "list_ad_groups": {
        const customer = getCustomer(a.customer_id);
        const dr = a.date_range || "LAST_30_DAYS";
        const campaignFilter = a.campaign_id ? `AND ad_group.campaign = 'customers/${(a.customer_id || DEFAULT_CUSTOMER).replace(/-/g, "")}/campaigns/${a.campaign_id}'` : "";
        const rows = await customer.query(`
          SELECT
            ad_group.id,
            ad_group.name,
            ad_group.status,
            ad_group.type,
            campaign.name,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions
          FROM ad_group
          WHERE ad_group.status != 'REMOVED'
            ${campaignFilter}
            AND segments.date DURING ${dr}
          ORDER BY metrics.cost_micros DESC
        `);
        if (!rows.length) return text("Nenhum grupo de anúncio encontrado.");
        const lines = rows.map((r: any) => {
          const g = r.ad_group;
          const m = r.metrics;
          const status = g.status === 2 ? "✓" : "⏸";
          return `${status} ID ${g.id} — ${g.name} [${r.campaign.name}]\n  Cliques: ${m.clicks} | Custo: ${microsToBrl(m.cost_micros || 0)} | Conv: ${fmtNum(m.conversions || 0, 1)}`;
        });
        return text(`Grupos de anúncio:\n\n${lines.join("\n\n")}`);
      }

      // ── list_keywords ────────────────────────────────────────────────────────
      case "list_keywords": {
        const customer = getCustomer(a.customer_id);
        const dr = a.date_range || "LAST_30_DAYS";
        const campaignFilter = a.campaign_id
          ? `AND campaign.id = ${a.campaign_id}` : "";
        const statusFilter = a.status && a.status !== "ALL"
          ? `AND ad_group_criterion.status = '${a.status}'` : "";
        const rows = await customer.query(`
          SELECT
            ad_group_criterion.criterion_id,
            ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type,
            ad_group_criterion.status,
            ad_group_criterion.effective_cpc_bid_micros,
            ad_group.id,
            ad_group.name,
            campaign.id,
            campaign.name,
            metrics.impressions,
            metrics.clicks,
            metrics.ctr,
            metrics.average_cpc,
            metrics.cost_micros,
            metrics.conversions,
            quality_info.quality_score
          FROM keyword_view
          WHERE ad_group_criterion.status != 'REMOVED'
            ${campaignFilter}
            ${statusFilter}
            AND segments.date DURING ${dr}
          ORDER BY metrics.cost_micros DESC
          LIMIT 100
        `);
        if (!rows.length) return text("Nenhuma palavra-chave encontrada.");
        const lines = rows.map((r: any) => {
          const k = r.ad_group_criterion;
          const m = r.metrics;
          const qs = r.quality_info?.quality_score;
          const status = k.status === 2 ? "✓" : "⏸";
          const matchLabel: Record<string, string> = { "2": "ampla", "3": "frase", "4": "exata" };
          const match = matchLabel[String(k.keyword?.match_type)] || `${k.keyword?.match_type}`;
          return `${status} [${match}] "${k.keyword?.text}" | CriterionID: ${k.criterion_id} | AdGroup: ${r.ad_group.id}\n  Cliques: ${m.clicks} | CPC médio: ${microsToBrl(m.average_cpc || 0)} | Custo: ${microsToBrl(m.cost_micros || 0)} | Conv: ${fmtNum(m.conversions || 0, 1)}${qs ? ` | QS: ${qs}/10` : ""}`;
        });
        return text(`Palavras-chave (${dr}):\n\n${lines.join("\n\n")}`);
      }

      // ── list_negative_keywords ───────────────────────────────────────────────
      case "list_negative_keywords": {
        const customer = getCustomer(a.customer_id);
        const campaignFilter = a.campaign_id
          ? `AND campaign.id = ${a.campaign_id}` : "";
        const rows = await customer.query(`
          SELECT
            campaign_criterion.criterion_id,
            campaign_criterion.keyword.text,
            campaign_criterion.keyword.match_type,
            campaign.id,
            campaign.name
          FROM campaign_criterion
          WHERE campaign_criterion.negative = true
            AND campaign_criterion.type = 'KEYWORD'
            ${campaignFilter}
          ORDER BY campaign.name, campaign_criterion.keyword.text
        `);
        if (!rows.length) return text("Nenhuma palavra-chave negativa encontrada.");
        let current = "";
        const lines: string[] = [];
        for (const r of rows) {
          const c = r.campaign;
          const k = r.campaign_criterion;
          const matchLabel: Record<string, string> = { "2": "ampla", "3": "frase", "4": "exata" };
          const match = matchLabel[String(k?.keyword?.match_type)] || `${k?.keyword?.match_type}`;
          const cName = String(c?.name ?? "");
          const cId = String(c?.id ?? "");
          if (cName !== current) {
            lines.push(`\n── ${cName} (ID: ${cId}) ──`);
            current = cName;
          }
          lines.push(`  • [${match}] "${k?.keyword?.text}" — CriterionID: ${k?.criterion_id}`);
        }
        return text(`Palavras-chave negativas:\n${lines.join("\n")}`);
      }

      // ── add_negative_keywords ────────────────────────────────────────────────
      case "add_negative_keywords": {
        const customer = getCustomer(a.customer_id);
        const customerId = (a.customer_id || DEFAULT_CUSTOMER).replace(/-/g, "");
        const campaignId = String(a.campaign_id);
        const keywords: string[] = a.keywords || [];
        const matchType = matchTypeEnum(a.match_type || "PHRASE");

        if (!keywords.length) return text("Nenhuma palavra-chave fornecida.");

        const operations = keywords.map((kw: string) => ({
          campaign: `customers/${customerId}/campaigns/${campaignId}`,
          negative: true,
          type: enums.CriterionType.KEYWORD,
          keyword: {
            text: kw.trim().toLowerCase(),
            match_type: matchType,
          },
        }));

        const result = await customer.campaignCriteria.create(operations);
        const added = Array.isArray(result.results) ? result.results.length : keywords.length;
        return text(`✓ ${added} palavras-chave negativas adicionadas à campanha ${campaignId}:\n${keywords.map(k => `  • "${k}"`).join("\n")}`);
      }

      // ── remove_negative_keyword ──────────────────────────────────────────────
      case "remove_negative_keyword": {
        const customer = getCustomer(a.customer_id);
        const customerId = (a.customer_id || DEFAULT_CUSTOMER).replace(/-/g, "");
        const resourceName = `customers/${customerId}/campaignCriteria/${a.campaign_id}~${a.criterion_id}`;
        await (customer as any).mutateResources([{
          _resource: "CampaignCriterion",
          _operation: "remove",
          resource_name: resourceName,
        }]);
        return text(`✓ Negativa ID ${a.criterion_id} removida da campanha ${a.campaign_id}.`);
      }

      // ── get_search_terms_report ──────────────────────────────────────────────
      case "get_search_terms_report": {
        const customer = getCustomer(a.customer_id);
        const dr = a.date_range || "LAST_30_DAYS";
        const minClicks = a.min_clicks ?? 1;
        const limit = a.limit ?? 100;
        const campaignFilter = a.campaign_id ? `AND campaign.id = ${a.campaign_id}` : "";
        const rows = await customer.query(`
          SELECT
            search_term_view.search_term,
            search_term_view.status,
            campaign.id,
            campaign.name,
            ad_group.name,
            metrics.impressions,
            metrics.clicks,
            metrics.ctr,
            metrics.average_cpc,
            metrics.cost_micros,
            metrics.conversions
          FROM search_term_view
          WHERE segments.date DURING ${dr}
            AND metrics.clicks >= ${minClicks}
            ${campaignFilter}
          ORDER BY metrics.cost_micros DESC
          LIMIT ${limit}
        `);
        if (!rows.length) return text(`Nenhum termo de pesquisa com >= ${minClicks} cliques no período ${dr}.`);
        const lines = rows.map((r: any) => {
          const t = r.search_term_view;
          const m = r.metrics;
          const statusLabel: Record<string, string> = { "2": "ADICIONADO", "3": "EXCLUÍDO", "4": "NENHUM" };
          const status = statusLabel[String(t.status)] || `${t.status}`;
          return `[${status}] "${t.search_term}" | Campanha: ${r.campaign.name}\n  Cliques: ${m.clicks} | CPC: ${microsToBrl(m.average_cpc || 0)} | Custo: ${microsToBrl(m.cost_micros || 0)} | Conv: ${fmtNum(m.conversions || 0, 1)}`;
        });
        return text(`Termos de pesquisa (${dr}, top ${rows.length}):\n\n${lines.join("\n\n")}`);
      }

      // ── get_campaign_performance ─────────────────────────────────────────────
      case "get_campaign_performance": {
        const customer = getCustomer(a.customer_id);
        const dr = a.date_range || "LAST_30_DAYS";
        const rows = await customer.query(`
          SELECT
            campaign.id,
            campaign.name,
            campaign.status,
            metrics.impressions,
            metrics.clicks,
            metrics.ctr,
            metrics.average_cpc,
            metrics.cost_micros,
            metrics.conversions,
            metrics.cost_per_conversion,
            metrics.conversion_rate,
            metrics.search_impression_share,
            metrics.search_budget_lost_impression_share,
            metrics.search_rank_lost_impression_share
          FROM campaign
          WHERE campaign.status != 'REMOVED'
            AND segments.date DURING ${dr}
          ORDER BY metrics.cost_micros DESC
        `);
        if (!rows.length) return text("Sem dados de performance.");
        const lines = rows.map((r: any) => {
          const c = r.campaign;
          const m = r.metrics;
          const status = c.status === 2 ? "✓" : "⏸";
          return [
            `${status} ${c.name} (ID: ${c.id})`,
            `  Impressões: ${m.impressions} | Cliques: ${m.clicks} | CTR: ${fmtNum((m.ctr || 0) * 100)}%`,
            `  CPC médio: ${microsToBrl(m.average_cpc || 0)} | Custo total: ${microsToBrl(m.cost_micros || 0)}`,
            `  Conversões: ${fmtNum(m.conversions || 0, 1)} | Taxa conv: ${fmtNum((m.conversion_rate || 0) * 100)}% | Custo/conv: ${m.conversions ? microsToBrl(m.cost_per_conversion || 0) : "—"}`,
            `  Impressão share: ${fmtNum((m.search_impression_share || 0) * 100)}% | Perdido budget: ${fmtNum((m.search_budget_lost_impression_share || 0) * 100)}% | Perdido rank: ${fmtNum((m.search_rank_lost_impression_share || 0) * 100)}%`,
          ].join("\n");
        });
        return text(`Performance por campanha (${dr}):\n\n${lines.join("\n\n")}`);
      }

      // ── get_keyword_performance ──────────────────────────────────────────────
      case "get_keyword_performance": {
        const customer = getCustomer(a.customer_id);
        const dr = a.date_range || "LAST_30_DAYS";
        const limit = a.limit ?? 50;
        const orderBy = a.order_by || "cost";
        const orderMap: Record<string, string> = {
          cost: "metrics.cost_micros",
          clicks: "metrics.clicks",
          conversions: "metrics.conversions",
          ctr: "metrics.ctr",
        };
        const orderField = orderMap[orderBy] || "metrics.cost_micros";
        const campaignFilter = a.campaign_id ? `AND campaign.id = ${a.campaign_id}` : "";
        const rows = await customer.query(`
          SELECT
            ad_group_criterion.criterion_id,
            ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type,
            ad_group_criterion.status,
            campaign.name,
            ad_group.name,
            metrics.impressions,
            metrics.clicks,
            metrics.ctr,
            metrics.average_cpc,
            metrics.cost_micros,
            metrics.conversions,
            metrics.cost_per_conversion,
            quality_info.quality_score
          FROM keyword_view
          WHERE ad_group_criterion.status != 'REMOVED'
            ${campaignFilter}
            AND segments.date DURING ${dr}
          ORDER BY ${orderField} DESC
          LIMIT ${limit}
        `);
        if (!rows.length) return text("Sem dados de palavras-chave.");
        const lines = rows.map((r: any) => {
          const k = r.ad_group_criterion;
          const m = r.metrics;
          const qs = r.quality_info?.quality_score;
          const matchLabel: Record<string, string> = { "2": "ampla", "3": "frase", "4": "exata" };
          const match = matchLabel[String(k.keyword?.match_type)] || "?";
          const status = k.status === 2 ? "✓" : "⏸";
          return `${status} [${match}] "${k.keyword?.text}" | ID: ${k.criterion_id}${qs ? ` | QS: ${qs}/10` : ""}\n  Campanha: ${r.campaign.name} | Grupo: ${r.ad_group.name}\n  Cliques: ${m.clicks} | CPC: ${microsToBrl(m.average_cpc || 0)} | Custo: ${microsToBrl(m.cost_micros || 0)} | Conv: ${fmtNum(m.conversions || 0, 1)}`;
        });
        return text(`Palavras-chave (${dr}, top ${rows.length}, ordenado por ${orderBy}):\n\n${lines.join("\n\n")}`);
      }

      // ── update_campaign_budget ───────────────────────────────────────────────
      case "update_campaign_budget": {
        const customer = getCustomer(a.customer_id);
        const customerId = (a.customer_id || DEFAULT_CUSTOMER).replace(/-/g, "");

        // First get the budget resource name for this campaign
        const campaignRows = await customer.query(`
          SELECT campaign.id, campaign.name, campaign_budget.id, campaign_budget.name, campaign_budget.amount_micros
          FROM campaign
          WHERE campaign.id = ${a.campaign_id}
          LIMIT 1
        `);
        if (!campaignRows.length) return text(`Campanha ${a.campaign_id} não encontrada.`);
        const campaignRow = campaignRows[0] as any;
        const budgetId = campaignRow.campaign_budget?.id;
        const oldBudget = microsToBrl(campaignRow.campaign_budget?.amount_micros || 0);

        if (!budgetId) return text("Orçamento da campanha não encontrado.");

        const newMicros = Math.round(a.daily_budget_brl * 1_000_000);
        await customer.campaignBudgets.update([{
          resource_name: `customers/${customerId}/campaignBudgets/${budgetId}`,
          amount_micros: newMicros,
        }]);

        return text(`✓ Orçamento da campanha "${campaignRow.campaign.name}" atualizado:\n  Antes: ${oldBudget}/dia\n  Agora: R$${fmtNum(a.daily_budget_brl, 2)}/dia`);
      }

      // ── update_campaign_status ───────────────────────────────────────────────
      case "update_campaign_status": {
        const customer = getCustomer(a.customer_id);
        const customerId = (a.customer_id || DEFAULT_CUSTOMER).replace(/-/g, "");
        const newStatus = a.status === "ENABLED" ? enums.CampaignStatus.ENABLED : enums.CampaignStatus.PAUSED;

        await customer.campaigns.update([{
          resource_name: `customers/${customerId}/campaigns/${a.campaign_id}`,
          status: newStatus,
        }]);

        const label = a.status === "ENABLED" ? "✓ ATIVADA" : "⏸ PAUSADA";
        return text(`${label} — Campanha ID ${a.campaign_id} foi ${a.status === "ENABLED" ? "ativada" : "pausada"}.`);
      }

      // ── update_keyword_bid ───────────────────────────────────────────────────
      case "update_keyword_bid": {
        const customer = getCustomer(a.customer_id);
        const customerId = (a.customer_id || DEFAULT_CUSTOMER).replace(/-/g, "");
        const newMicros = Math.round(a.max_cpc_brl * 1_000_000);

        await customer.adGroupCriteria.update([{
          resource_name: `customers/${customerId}/adGroupCriteria/${a.ad_group_id}~${a.criterion_id}`,
          cpc_bid_micros: newMicros,
        }]);

        return text(`✓ CPC máximo da palavra-chave ${a.criterion_id} atualizado para R$${fmtNum(a.max_cpc_brl, 2)}.`);
      }

      // ── update_keyword_status ────────────────────────────────────────────────
      case "update_keyword_status": {
        const customer = getCustomer(a.customer_id);
        const customerId = (a.customer_id || DEFAULT_CUSTOMER).replace(/-/g, "");
        const newStatus = a.status === "ENABLED" ? enums.AdGroupCriterionStatus.ENABLED : enums.AdGroupCriterionStatus.PAUSED;

        await customer.adGroupCriteria.update([{
          resource_name: `customers/${customerId}/adGroupCriteria/${a.ad_group_id}~${a.criterion_id}`,
          status: newStatus,
        }]);

        const label = a.status === "ENABLED" ? "✓ ATIVADA" : "⏸ PAUSADA";
        return text(`${label} — Palavra-chave ID ${a.criterion_id} foi ${a.status === "ENABLED" ? "ativada" : "pausada"}.`);
      }

      // ── run_gaql ─────────────────────────────────────────────────────────────
      case "run_gaql": {
        const customer = getCustomer(a.customer_id);
        const rows = await customer.query(a.query);
        if (!rows.length) return text("Query retornou 0 resultados.");
        return text(`${rows.length} linha(s) retornada(s):\n\n${JSON.stringify(rows, null, 2)}`);
      }

      default:
        return text(`Tool desconhecida: ${name}`);
    }
  } catch (error: any) {
    const msg = error?.errors?.[0]?.message || error?.message || String(error);
    return {
      content: [{ type: "text", text: `Erro: ${msg}` }],
      isError: true,
    };
  }
});

function text(content: string) {
  return { content: [{ type: "text", text: content }] };
}

// ─── Start ────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
