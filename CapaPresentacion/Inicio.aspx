<%@ Page Title="" Language="C#" MasterPageFile="~/HomePage.Master" AutoEventWireup="true" CodeBehind="Inicio.aspx.cs" Inherits="CapaPresentacion.Inicio" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header border-bottom border-dashed d-flex align-items-center">
                    <h4 class="header-title">Custom Switch</h4>
                </div>

                <div class="card-body">
                    <p class="text-muted">
                        Here are a few types of switches.
                    </p>
                    <!-- without label-->
                    <input type="checkbox" id="switch0" data-switch="none" />
                    <label for="switch0" data-on-label="" data-off-label=""></label>

                    <!-- Bool Switch-->
                    <input type="checkbox" id="switch1" checked data-switch="bool" />
                    <label for="switch1" data-on-label="On" data-off-label="Off"></label>

                    <!-- Primary Switch-->
                    <input type="checkbox" id="switch2" checked data-switch="primary" />
                    <label for="switch2" data-on-label="On" data-off-label="Off"></label>

                    <!-- Success Switch-->
                    <input type="checkbox" id="switch3" checked data-switch="success" />
                    <label for="switch3" data-on-label="Yes" data-off-label="No"></label>

                    <!-- Info Switch-->
                    <input type="checkbox" id="switch4" checked data-switch="info" />
                    <label for="switch4" data-on-label="On" data-off-label="Off"></label>

                    <!-- Warning Switch-->
                    <input type="checkbox" id="switch5" checked data-switch="warning" />
                    <label for="switch5" data-on-label="Yes" data-off-label="No"></label>

                    <!-- Danger Switch-->
                    <input type="checkbox" id="switch6" checked data-switch="danger" />
                    <label for="switch6" data-on-label="On" data-off-label="Off"></label>

                    <!-- Dark Switch-->
                    <input type="checkbox" id="switch7" checked data-switch="secondary" />
                    <label for="switch7" data-on-label="Yes" data-off-label="No"></label>

                    <!-- Disabled Switch-->
                    <input type="checkbox" id="switchdis" data-switch="primary" checked disabled />
                    <label for="switchdis" data-on-label="On" data-off-label="Off"></label>
                </div>
                <!-- end card-body -->
            </div>
            <!-- end card-->
        </div>
        <!-- end col -->
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
</asp:Content>
