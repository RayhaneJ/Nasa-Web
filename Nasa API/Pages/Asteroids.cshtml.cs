using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Nasa_API.Helpers;
using Nasa_API.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Nasa_API.Pages
{
    public class AsteroidsModel : PageModel
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IList<NasaAsteroid> nasaAsteroids = new List<NasaAsteroid>();
        public AsteroidsModel(IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _httpClient = clientFactory.CreateClient();
            _configuration = configuration;
        }

        public void OnGet()
        {
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            _httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

            string baseURL = _configuration.GetSection("NASA_OpenAPIs:BaseURL").Value;
            string key = _configuration.GetSection("NASA_OpenAPIs:Key").Value;

            DateTime firstDayOfTheWeek = DateTime.Now.StartOfWeek(DayOfWeek.Monday);
            DateTime lastDayOfTheWeek = firstDayOfTheWeek.AddDays(6);

            HttpResponseMessage response = _httpClient.GetAsync(baseURL + "neo/rest/v1/feed?"+ $"start_date=" + firstDayOfTheWeek.ToString("yyyy-MM-dd") + $"&end_date=" + lastDayOfTheWeek.ToString("yyyy-MM-dd") + $"&api_key={key}").Result;

            response.EnsureSuccessStatusCode();

            string content = response.Content.ReadAsStringAsync().Result;
            dynamic resultObjects = AllChildren(JObject.Parse(content)).First(c=>c.Type== JTokenType.Array && c.Path.Contains("near_earth_objects")).Children<JObject>();

            foreach (JObject result  in resultObjects)
            {
                NasaAsteroid nasaAsteroid = new NasaAsteroid();
                foreach (   JProperty property in result.Properties())
                {
                    switch (property.Name.ToString())
                    {
                        case "id":
                            nasaAsteroid.Id = (string)property.Value;
                            break;
                        case "name":
                            nasaAsteroid.Name = (string)property.Value;
                            var charsToRemove = new string[] { "(", ")"};
                            foreach (var c in charsToRemove)
                            {
                                nasaAsteroid.Name = nasaAsteroid.Name.Replace(c, string.Empty);
                            }
                            break;
                        case "nasa_jpl_url":
                            nasaAsteroid.Url = (string)property.Value;
                            break;
                        case "absolute_magnitude_h":
                            nasaAsteroid.Magnitude = (string)property.Value;
                            break;
                        case "estimated_diameter":
                            foreach (JObject jObject in property.Children<JObject>())
                            {
                                foreach (JProperty prop in jObject.Properties())
                                {
                                    if(prop.Name == "meters")
                                    {
                                        int diameterMin = (int)prop.First()["estimated_diameter_min"];
                                        int diameterMax = (int)prop.Last()["estimated_diameter_max"];

                                        int diameterAvg = (diameterMin + diameterMax) / 2;

                                        nasaAsteroid.Diameter_In_Meters = diameterAvg.ToString();
                                    }
                                }
                            }
                            break;
                        case "close_approach_data":
                            var value = property.First().First().First().First();
                            foreach (JObject jObject in property.First().Children<JObject>())
                            {
                                foreach (JProperty prop in jObject.Properties())
                                {
                                    if (prop.Name == "relative_velocity")
                                    {
                                        nasaAsteroid.Kilometers_Per_Second = prop.First()["kilometers_per_hour"].ToString();

                                        if (nasaAsteroid.Kilometers_Per_Second.Contains('.'))
                                            nasaAsteroid.Kilometers_Per_Second = nasaAsteroid.Kilometers_Per_Second.Split('.')[0];
                                    }
                                    else
                                    {
                                        if (prop.Name == "miss_distance")
                                        {
                                            nasaAsteroid.Miss_Distance_In_Kilometers = prop.First()["kilometers"].ToString();

                                            if (nasaAsteroid.Miss_Distance_In_Kilometers.Contains('.'))
                                                nasaAsteroid.Miss_Distance_In_Kilometers = nasaAsteroid.Miss_Distance_In_Kilometers.Split('.')[0];
                                        }
                                    }
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
                nasaAsteroids.Add(nasaAsteroid);
            }
            Debug.WriteLine(nasaAsteroids);
            TempData["NasaAsteroids"] = nasaAsteroids;
        }

        private static IEnumerable<JToken> AllChildren(JToken json)
        {
            foreach (var c in json.Children())
            {
                yield return c;
                foreach (var cc in AllChildren(c))
                {
                    yield return cc;
                }
            }
        }


    }
}