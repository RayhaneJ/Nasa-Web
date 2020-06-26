using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Nasa_API.Models;
using Newtonsoft.Json;

namespace Nasa_API.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public IndexModel(ILogger<IndexModel> logger, IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _logger = logger;
            _httpClient = clientFactory.CreateClient();
            _configuration = configuration;

        }

        public async Task OnGet()
        {
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            _httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

            string baseURL = _configuration.GetSection("NASA_OpenAPIs:BaseURL").Value;
            string key = _configuration.GetSection("NASA_OpenAPIs:Key").Value;

            DateTime date = DateTime.Now.Date.AddDays(new Random().Next(0, 7) * -1);

            HttpResponseMessage response = _httpClient.GetAsync(baseURL + "planetary/apod?" + $"api_key={key}&" + $"date={date.ToString("yyyy-MM-dd")}").Result;

            response.EnsureSuccessStatusCode();

            string content = response.Content.ReadAsStringAsync().Result;
            dynamic result = JsonConvert.DeserializeObject(content);

            NasaImage nasaImage = new NasaImage
            {
                Date = date,
                Title = result.title,
                Description = result.explanation,
                Url = result.url,
                MediaType = result.media_type,
            };

            TempData["NasaImage"] = nasaImage;
        }


    }
}
